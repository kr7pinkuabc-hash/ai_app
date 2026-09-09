import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import db from "./db.js";
import { GoogleGenAI } from "@google/genai";
import CURRICULUM from "./curriculum.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --------------------------------------------------
// Gemini AI setup
// --------------------------------------------------

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(cors());
app.use(express.json());


// ==================================================
// HELPER FUNCTIONS
// ==================================================

// --------------------------------------------------
// Get today's date in India
// --------------------------------------------------

function getIndiaDate() {
    const now = new Date();

    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(now);
}


// --------------------------------------------------
// Calculate current login streak
// --------------------------------------------------

async function calculateStreak(userId) {

    const [rows] = await db.execute(
        `
        SELECT login_date
        FROM login_history
        WHERE user_id = ?
        ORDER BY login_date DESC
        `,
        [userId]
    );

    if (rows.length === 0) {
        return 0;
    }

    const dates = rows.map(row => {

        const date = new Date(row.login_date);

        date.setHours(0, 0, 0, 0);

        return date;
    });

    const today = new Date(getIndiaDate());

    today.setHours(0, 0, 0, 0);

    const latestLogin = dates[0];

    const daysSinceLatest = Math.round(
        (today - latestLogin) /
        (1000 * 60 * 60 * 24)
    );

    // Streak is broken if latest login
    // was more than one day ago.
    if (daysSinceLatest > 1) {
        return 0;
    }

    let streak = 1;

    for (let i = 0; i < dates.length - 1; i++) {

        const difference = Math.round(
            (dates[i] - dates[i + 1]) /
            (1000 * 60 * 60 * 24)
        );

        if (difference === 1) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}


// ==================================================
// AUTHENTICATION
// ==================================================

// --------------------------------------------------
// SIGN UP
// --------------------------------------------------

app.post("/api/signup", async (req, res) => {

    try {

        const { username, password } = req.body;

        // Basic validation
        if (!username || !password) {

            return res.status(400).json({
                success: false,
                message: "Username and password are required."
            });
        }

        const cleanUsername = username.trim();

        if (cleanUsername.length < 3) {

            return res.status(400).json({
                success: false,
                message: "Username must contain at least 3 characters."
            });
        }

        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters."
            });
        }

        // Check existing account
        const [existingUsers] = await db.execute(
            `
            SELECT id
            FROM users
            WHERE username = ?
            `,
            [cleanUsername]
        );

        if (existingUsers.length > 0) {

            return res.status(409).json({
                success: false,
                message: "Username already exists. Please log in."
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create account
        const [result] = await db.execute(
            `
            INSERT INTO users
            (username, password_hash)
            VALUES (?, ?)
            `,
            [cleanUsername, passwordHash]
        );

        res.status(201).json({
            success: true,
            message: "Account created successfully.",
            user: {
                id: result.insertId,
                username: cleanUsername
            }
        });

    } catch (error) {

        console.error("Signup error:", error);

        res.status(500).json({
            success: false,
            message: "Could not create account. Please try again."
        });
    }
});


// --------------------------------------------------
// LOGIN
// --------------------------------------------------

app.post("/api/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {

            return res.status(400).json({
                success: false,
                message: "Username and password are required."
            });
        }

        const cleanUsername = username.trim();

        // User must already exist
        const [users] = await db.execute(
            `
            SELECT *
            FROM users
            WHERE username = ?
            `,
            [cleanUsername]
        );

        if (users.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Account not found. Please sign up first."
            });
        }

        const user = users[0];

        // Verify password
        const passwordCorrect = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordCorrect) {

            return res.status(401).json({
                success: false,
                message: "Incorrect username or password."
            });
        }

        // Record today's login
        const today = getIndiaDate();

        await db.execute(
            `
            INSERT IGNORE INTO login_history
            (user_id, login_date)
            VALUES (?, ?)
            `,
            [user.id, today]
        );

        // Calculate streak
        const streak = await calculateStreak(user.id);

        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username
            },
            streak
        });

    } catch (error) {

        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Server error. Please try again."
        });
    }
});


// ==================================================
// ATTENDANCE / STREAK
// ==================================================

// --------------------------------------------------
// Get attendance and streak information
// --------------------------------------------------

app.get("/api/attendance/:userId", async (req, res) => {

    try {

        const userId = req.params.userId;

        const streak = await calculateStreak(userId);

        const [history] = await db.execute(
            `
            SELECT login_date
            FROM login_history
            WHERE user_id = ?
            ORDER BY login_date DESC
            `,
            [userId]
        );

        res.json({
            success: true,
            streak,
            loginHistory: history
        });

    } catch (error) {

        console.error("Attendance error:", error);

        res.status(500).json({
            success: false,
            message: "Could not load attendance information."
        });
    }
});


// ==================================================
// BASIC TEST ROUTE
// ==================================================

app.get("/", (req, res) => {

    res.send("AI Study Planner backend is running.");
});


// ==================================================
// SYLLABUS / SUBJECT APIs
// ==================================================

// --------------------------------------------------
// Get student's subjects
// --------------------------------------------------

app.get("/api/subjects/:userId", async (req, res) => {

    try {

        const userId = req.params.userId;

const [profileRows] = await db.execute(
    `
    SELECT class_name, board_name
    FROM user_academic_profiles
    WHERE user_id = ?
    LIMIT 1
    `,
    [userId]
);

if (profileRows.length === 0) {
    return res.json({
        success: true,
        subjects: []
    });
}

const className = profileRows[0].class_name;
const boardName = profileRows[0].board_name;

const [subjects] = await db.execute(
    `
    SELECT
        s.id,
        s.subject_name,
        COUNT(st.id) AS total_topics,
        COALESCE(SUM(st.completed), 0) AS completed_topics
    FROM subjects s
    LEFT JOIN syllabus_topics st
        ON s.id = st.subject_id
    WHERE s.user_id = ?
    AND s.class_name = ?
    AND s.board_name = ?
    GROUP BY s.id, s.subject_name
    ORDER BY s.id
    `,
    [userId, className, boardName]
);;

        const formattedSubjects = subjects.map(subject => {

            const totalTopics = Number(subject.total_topics);

            const completedTopics =
                Number(subject.completed_topics);

            const percentage =
                totalTopics === 0
                    ? 0
                    : Math.round(
                        (completedTopics / totalTopics) * 100
                    );

            return {
                id: subject.id,
                subject_name: subject.subject_name,
                total_topics: totalTopics,
                completed_topics: completedTopics,
                percentage
            };
        });

        res.json({
            success: true,
            subjects: formattedSubjects
        });

    } catch (error) {

        console.error("Get subjects error:", error);

        res.status(500).json({
            success: false,
            message: "Could not load subjects."
        });
    }
});


// --------------------------------------------------
// Get topics for a subject
// --------------------------------------------------

app.get("/api/syllabus/:subjectId", async (req, res) => {

    try {

        const subjectId = req.params.subjectId;

        const [topics] = await db.execute(
            `
            SELECT
                id,
                topic_name,
                completed,
                completed_at
            FROM syllabus_topics
            WHERE subject_id = ?
            ORDER BY id
            `,
            [subjectId]
        );

        res.json({
            success: true,
            topics
        });

    } catch (error) {

        console.error("Get syllabus error:", error);

        res.status(500).json({
            success: false,
            message: "Could not load syllabus."
        });
    }
});


// --------------------------------------------------
// Mark topic complete / incomplete
// --------------------------------------------------

app.put("/api/syllabus/topic/:topicId", async (req, res) => {

    try {

        const topicId = req.params.topicId;
        const { completed } = req.body;

        await db.execute(
            `
            UPDATE syllabus_topics
            SET
                completed = ?,
                completed_at = CASE
                    WHEN ? = 1 THEN NOW()
                    ELSE NULL
                END
            WHERE id = ?
            `,
            [
                completed ? 1 : 0,
                completed ? 1 : 0,
                topicId
            ]
        );

        res.json({
            success: true,
            message: "Topic progress updated."
        });

    } catch (error) {

        console.error(
            "Update syllabus topic error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Could not update topic."
        });
    }
});


// ==================================================
// CURRICULUM
// ==================================================

// --------------------------------------------------
// Get available classes and boards
// --------------------------------------------------

app.get("/api/curriculum/options", (req, res) => {

    try {

        const classes = Object.keys(CURRICULUM);

        const boards = [
            "CBSE",
            "Maharashtra State Board"
        ];

        res.json({
            success: true,
            classes,
            boards
        });

    } catch (error) {

        console.error(
            "Curriculum options error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Could not load curriculum options."
        });
    }
});


// --------------------------------------------------
// Get subjects for class + board
// --------------------------------------------------

app.get(
    "/api/curriculum/:className/:boardName",
    (req, res) => {

        try {

            const className =
                decodeURIComponent(req.params.className);

            const boardName =
                decodeURIComponent(req.params.boardName);

            const curriculum =
                CURRICULUM[className]?.[boardName];

            if (!curriculum) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Curriculum not available for this class and board."
                });
            }

            res.json({
                success: true,
                className,
                boardName,
                academicYear:
                    curriculum.academicYear,
                subjects:
                    Object.keys(curriculum.subjects)
            });

        } catch (error) {

            console.error(
                "Curriculum error:",
                error
            );

            res.status(500).json({
                success: false,
                message: "Could not load curriculum."
            });
        }
    }
);


// --------------------------------------------------
// Save class + board + selected subjects
// AND automatically load syllabus topics
// --------------------------------------------------

app.post("/api/curriculum/setup", async (req, res) => {

    try {

        const {
            userId,
            className,
            boardName,
            selectedSubjects
        } = req.body;

        if (
            !userId ||
            !className ||
            !boardName ||
            !Array.isArray(selectedSubjects) ||
            selectedSubjects.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Class, board and subjects are required."
            });
        }

        const curriculum =
            CURRICULUM[className]?.[boardName];

        if (!curriculum) {

            return res.status(404).json({
                success: false,
                message:
                    "Selected curriculum is not available."
            });
        }


        // ------------------------------------------
        // Save academic profile
        // ------------------------------------------

        await db.execute(
            `
            INSERT INTO user_academic_profiles
            (
                user_id,
                class_name,
                board_name,
                academic_year
            )
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                class_name = VALUES(class_name),
                board_name = VALUES(board_name),
                academic_year = VALUES(academic_year)
            `,
            [
                userId,
                className,
                boardName,
                curriculum.academicYear
            ]
        );


        // ------------------------------------------
        // Add each selected subject
        // ------------------------------------------

        for (const subjectName of selectedSubjects) {

            const topics =
                curriculum.subjects[subjectName];

            if (!topics) {
                continue;
            }


            // --------------------------------------
            // Check whether subject already exists
            // --------------------------------------

            const [existingSubject] = await db.execute(
                `
                SELECT id
                FROM subjects
                WHERE user_id = ?
                AND subject_name = ?
                AND class_name = ?
                AND board_name = ?
                LIMIT 1
                `,
                [userId, 
                subjectName, className, boardName]
            );


            let subjectId;


            if (existingSubject.length > 0) {

                // Use existing subject
                subjectId = existingSubject[0].id;

            } else {

                // Create new subject
                const [result] = await db.execute(
                    `
                    INSERT INTO subjects
                    (user_id, subject_name, class_name, board_name)
                    VALUES (?, ?, ?, ?)
                    `,
                    [userId, subjectName, className, boardName]
                );

                subjectId = result.insertId;
            }


            // --------------------------------------
            // Add topics
            // --------------------------------------

            for (const topic of topics) {

                // Check if topic already exists
                const [existingTopic] =
                    await db.execute(
                        `
                        SELECT id
                        FROM syllabus_topics
                        WHERE subject_id = ?
                        AND topic_name = ?
                        LIMIT 1
                        `,
                        [subjectId, topic]
                    );


                if (existingTopic.length === 0) {

                    await db.execute(
                        `
                        INSERT INTO syllabus_topics
                        (
                            subject_id,
                            topic_name
                        )
                        VALUES (?, ?)
                        `,
                        [subjectId, topic]
                    );
                }
            }
        }


        res.json({
            success: true,
            message: "Syllabus loaded successfully."
        });

    } catch (error) {

        console.error(
            "Curriculum setup error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Could not load syllabus."
        });
    }
});


// --------------------------------------------------
// Get student's academic profile
// --------------------------------------------------

app.get(
    "/api/curriculum/profile/:userId",
    async (req, res) => {

        try {

            const userId = req.params.userId;

            const [rows] = await db.execute(
                `
                SELECT
                    class_name,
                    board_name,
                    academic_year
                FROM user_academic_profiles
                WHERE user_id = ?
                `,
                [userId]
            );

            if (rows.length === 0) {

                return res.json({
                    success: true,
                    profile: null
                });
            }

            res.json({
                success: true,
                profile: rows[0]
            });

        } catch (error) {

            console.error(
                "Academic profile error:",
                error
            );

            res.status(500).json({
                success: false,
                message:
                    "Could not load academic profile."
            });
        }
    }
);


// ==================================================
// AI STUDY ASSISTANT
// ==================================================

app.post("/api/ai", async (req, res) => {

    try {

        const { question } = req.body;

        if (!question || !question.trim()) {

            return res.status(400).json({
                success: false,
                message: "Please enter a question."
            });
        }


        const prompt = `
You are an AI Study Assistant inside a school and
high-school exam preparation application.

Your job is to help students understand academic
topics, complete their syllabus, prepare study plans,
and prepare for examinations.

The student may be studying in middle school or
high school.

Rules:
- Explain concepts in simple, student-friendly language.
- Use examples where useful.
- Keep answers focused on education and exam preparation.
- For technical subjects, provide clear step-by-step
  explanations.
- For mathematics, show the method clearly.
- For exam preparation, provide practical guidance.
- Never invent an official syllabus.
- Do not unnecessarily make answers extremely long.
- Encourage understanding and practice rather than
  simply memorising answers.

Student question:
${question}
`;


        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt
        });


        res.json({
            success: true,
            answer: response.text
        });

    } catch (error) {

        console.error("AI error:", error);

        res.status(500).json({
            success: false,
            message:
                "AI service is currently unavailable."
        });
    }
});


// ==================================================
// START SERVER
// ==================================================

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `AI Study Planner backend running on port ${PORT}`
    );

});