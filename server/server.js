import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import db from "./db.js";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


// --------------------------------------------------
// Helper: Get today's date in India
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
// Helper: Calculate current streak
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
        (today - latestLogin) / (1000 * 60 * 60 * 24)
    );

    // If user hasn't logged in today or yesterday,
    // their active streak is broken.
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


// --------------------------------------------------
// Login API
// --------------------------------------------------

// --------------------------------------------------
// Sign Up API
// --------------------------------------------------

app.post("/api/signup", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required."
            });
        }

        if (username.trim().length < 3) {
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

        // Check whether username already exists
        const [existingUsers] = await db.execute(
            "SELECT id FROM users WHERE username = ?",
            [username.trim()]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Username already exists. Please log in."
            });
        }

        // Hash password before storing it
        const passwordHash = await bcrypt.hash(password, 10);

        const [result] = await db.execute(
            `
            INSERT INTO users (username, password_hash)
            VALUES (?, ?)
            `,
            [username.trim(), passwordHash]
        );

        res.status(201).json({
            success: true,
            message: "Account created successfully.",
            user: {
                id: result.insertId,
                username: username.trim()
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
// Login API
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

        // User MUST already exist
        const [users] = await db.execute(
            "SELECT * FROM users WHERE username = ?",
            [username.trim()]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Account not found. Please sign up first."
            });
        }

        const user = users[0];

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


// --------------------------------------------------
// Get attendance/streak information
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


// --------------------------------------------------
// Test route
// --------------------------------------------------

app.get("/", (req, res) => {
    res.send("AI App backend is running.");
});


// --------------------------------------------------
// Start server
// --------------------------------------------------

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// --------------------------------------------------
// AI Study Assistant API
// --------------------------------------------------
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
You are an AI Study Assistant inside a college study planner and exam preparation application.

Your job is to help students understand academic topics and prepare for exams.

Rules:
- Explain concepts in simple language.
- Use examples where useful.
- Keep answers focused on studying and education.
- For technical subjects, provide clear step-by-step explanations.
- For exam preparation, give practical study guidance.
- Do not unnecessarily make answers extremely long.

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
            message: "AI service is currently unavailable."
        });
    }
});