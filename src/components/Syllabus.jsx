import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const API_URL = "https://studysync-ai-f06n.onrender.com";

export default function Syllabus() {

    const { user } = useContext(AuthContext);

    const [classes, setClasses] = useState([]);
    const [boards, setBoards] = useState([]);

    const [selectedClass, setSelectedClass] = useState("");
    const [selectedBoard, setSelectedBoard] = useState("");

    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);

    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [topics, setTopics] = useState([]);

    const [setupDone, setSetupDone] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");


    // ------------------------------------------
    // Load class and board options
    // ------------------------------------------

    useEffect(() => {

        const loadOptions = async () => {

            try {

                const response = await fetch(
                    `${API_URL}/api/curriculum/options`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                setClasses(data.classes);
                setBoards(data.boards);

            } catch (error) {

                setError(error.message);
            }
        };

        loadOptions();

    }, []);


    // ------------------------------------------
    // Check existing profile
    // ------------------------------------------

    useEffect(() => {

        const loadProfile = async () => {

            if (!user?.id) return;

            try {

                const response = await fetch(
                    `${API_URL}/api/curriculum/profile/${user.id}`
                );

                const data = await response.json();

                if (data.profile) {

                    setSelectedClass(data.profile.class_name);
                    setSelectedBoard(data.profile.board_name);
                    setSetupDone(true);

                    loadSubjects();
                }

            } catch (error) {

                console.error(error);
            }
        };

        loadProfile();

    }, [user?.id]);


    // ------------------------------------------
    // Load available subjects
    // ------------------------------------------

    useEffect(() => {

        const loadAvailableSubjects = async () => {

            if (!selectedClass || !selectedBoard) {
                setAvailableSubjects([]);
                return;
            }

            try {

                const response = await fetch(
                    `${API_URL}/api/curriculum/${encodeURIComponent(selectedClass)}/${encodeURIComponent(selectedBoard)}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message);
                }

                setAvailableSubjects(data.subjects);

            } catch (error) {

                setError(error.message);
            }
        };

        loadAvailableSubjects();

    }, [selectedClass, selectedBoard]);


    // ------------------------------------------
    // Load student's subjects
    // ------------------------------------------

    const loadSubjects = async () => {

        if (!user?.id) return;

        try {

            const response = await fetch(
                `${API_URL}/api/subjects/${user.id}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setSubjects(data.subjects);

        } catch (error) {

            setError(error.message);
        }
    };


    // ------------------------------------------
    // Select subject
    // ------------------------------------------

    const selectSubject = async (subject) => {

        try {

            setSelectedSubject(subject);

            const response = await fetch(
                `${API_URL}/api/syllabus/${subject.id}`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setTopics(data.topics);

        } catch (error) {

            setError(error.message);
        }
    };


    // ------------------------------------------
    // Subject checkbox
    // ------------------------------------------

    const toggleSubject = (subjectName) => {

        setSelectedSubjects(previous => {

            if (previous.includes(subjectName)) {

                return previous.filter(
                    subject => subject !== subjectName
                );

            }

            return [...previous, subjectName];
        });
    };


    // ------------------------------------------
    // Load syllabus
    // ------------------------------------------

    const loadSyllabus = async () => {

        if (!selectedClass || !selectedBoard) {

            setError("Please select your class and board.");

            return;
        }

        if (selectedSubjects.length === 0) {

            setError("Please select at least one subject.");

            return;
        }

        try {

            setLoading(true);
            setError("");
            setMessage("");

            const response = await fetch(
                `${API_URL}/api/curriculum/setup`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        userId: user.id,
                        className: selectedClass,
                        boardName: selectedBoard,
                        selectedSubjects
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            setSetupDone(true);

            setMessage(
                "Your syllabus has been loaded successfully."
            );

            await loadSubjects();

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    };


    // ------------------------------------------
    // Toggle topic
    // ------------------------------------------

    const toggleTopic = async (topic) => {

        try {

            const completed = !Boolean(topic.completed);

            const response = await fetch(
                `${API_URL}/api/syllabus/topic/${topic.id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        completed
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            await selectSubject(selectedSubject);

            await loadSubjects();

        } catch (error) {

            setError(error.message);
        }
    };


    // ------------------------------------------
    // Setup screen
    // ------------------------------------------

    if (!setupDone) {

        return (
            <div className="page syllabus-page">

                <div className="syllabus-header">

                    <h1>📚 Set Up Your Syllabus</h1>

                    <p>
                        Select your class and board. We will load
                        the syllabus automatically.
                    </p>

                </div>


                <div className="syllabus-card">

                    <label>
                        Class
                    </label>

                    <select
                        value={selectedClass}
                        onChange={(e) => {

                            setSelectedClass(e.target.value);

                            setSelectedBoard("");
                            setSelectedSubjects([]);
                        }}
                    >

                        <option value="">
                            Select Class
                        </option>

                        {classes.map(className => (

                            <option
                                key={className}
                                value={className}
                            >
                                {className}
                            </option>

                        ))}

                    </select>


                    <label>
                        Board
                    </label>

                    <select
                        value={selectedBoard}
                        onChange={(e) => {

                            setSelectedBoard(e.target.value);

                            setSelectedSubjects([]);
                        }}
                    >

                        <option value="">
                            Select Board
                        </option>

                        {boards.map(board => (

                            <option
                                key={board}
                                value={board}
                            >
                                {board}
                            </option>

                        ))}

                    </select>

                </div>


                {availableSubjects.length > 0 && (

                    <div className="syllabus-card">

                        <h2>
                            Select Your Subjects
                        </h2>

                        <p>
                            The complete syllabus for the selected
                            subjects will be loaded automatically.
                        </p>


                        <div className="subject-selection">

                            {availableSubjects.map(subject => (

                                <label
                                    className="subject-option"
                                    key={subject}
                                >

                                    <input
                                        type="checkbox"
                                        checked={selectedSubjects.includes(subject)}
                                        onChange={() =>
                                            toggleSubject(subject)
                                        }
                                    />

                                    <span>
                                        {subject}
                                    </span>

                                </label>

                            ))}

                        </div>


                        <button
                            onClick={loadSyllabus}
                            disabled={loading}
                        >
                            {loading
                                ? "Loading Syllabus..."
                                : "Load My Syllabus"
                            }
                        </button>

                    </div>

                )}


                {error && (
                    <div className="syllabus-error">
                        {error}
                    </div>
                )}

            </div>
        );
    }


    // ------------------------------------------
    // Main syllabus
    // ------------------------------------------

    return (

        <div className="page syllabus-page">

            <div className="syllabus-header">

                <h1>
                    📚 My Syllabus
                </h1>

                <p>
                    {selectedClass} • {selectedBoard}
                </p>

            </div>


            {message && (
                <div className="syllabus-success">
                    {message}
                </div>
            )}


            {error && (
                <div className="syllabus-error">
                    {error}
                </div>
            )}


            <div className="subject-grid">

                {subjects.map(subject => (

                    <button
                        key={subject.id}
                        className={
                            selectedSubject?.id === subject.id
                                ? "subject-card selected"
                                : "subject-card"
                        }
                        onClick={() =>
                            selectSubject(subject)
                        }
                    >

                        <div className="subject-card-top">

                            <h3>
                                {subject.subject_name}
                            </h3>

                            <strong>
                                {subject.percentage}%
                            </strong>

                        </div>


                        <div className="progress-bar">

                            <div
                                className="progress-fill"
                                style={{
                                    width: `${subject.percentage}%`
                                }}
                            />

                        </div>


                        <p>
                            {subject.completed_topics}
                            {" / "}
                            {subject.total_topics}
                            {" topics completed"}
                        </p>

                    </button>

                ))}

            </div>


            {selectedSubject && (

                <div className="syllabus-card">

                    <h2>
                        {selectedSubject.subject_name}
                    </h2>

                    <p>
                        Check a topic when you have completed
                        studying it.
                    </p>


                    <div className="topic-list">

                        {topics.map(topic => (

                            <label
                                key={topic.id}
                                className={
                                    topic.completed
                                        ? "topic-item completed"
                                        : "topic-item"
                                }
                            >

                                <input
                                    type="checkbox"
                                    checked={Boolean(topic.completed)}
                                    onChange={() =>
                                        toggleTopic(topic)
                                    }
                                />

                                <span>
                                    {topic.topic_name}
                                </span>

                            </label>

                        ))}

                    </div>

                </div>

            )}

        </div>
    );
}