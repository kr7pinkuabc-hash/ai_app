import { useState } from "react";

export default function AI() {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const askAI = async (customQuestion = null) => {
        const userQuestion = customQuestion || question;

        if (!userQuestion.trim()) {
            return;
        }

        setLoading(true);
        setAnswer("");
        setError("");

        try {
            const response = await fetch("https://studysync-ai-f06n.onrender.com/api/ai",  {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: userQuestion
                })
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || "Something went wrong.");
            }

            setAnswer(data.answer);

        } catch (error) {
            console.error(error);
            setError("Unable to connect to the AI. Make sure your backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page ai-page">

            <div className="ai-header">
                <h1>🤖 AI Study Assistant</h1>
                <p>
                    Ask questions, understand difficult topics and prepare for exams.
                </p>
            </div>

            <div className="ai-box">

                <textarea
                    placeholder="Ask something like: Explain OOP in Java in simple words..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />

                <button
                    onClick={() => askAI()}
                    disabled={loading}
                >
                    {loading ? "Thinking..." : "Ask AI"}
                </button>

            </div>

            <div className="quick-actions">

                <button
                    onClick={() =>
                        askAI("Explain this topic in simple language with an example.")
                    }
                >
                    📚 Explain Topic
                </button>

                <button
                    onClick={() =>
                        askAI("Create 10 exam-level MCQs on Java OOP and provide the answer key.")
                    }
                >
                    📝 Generate MCQs
                </button>

                <button
                    onClick={() =>
                        askAI("Create a one-week study plan for a college student preparing for exams.")
                    }
                >
                    📅 Create Study Plan
                </button>

            </div>

            {loading && (
                <div className="ai-response">
                    <h3>AI is thinking...</h3>
                    <p>Please wait.</p>
                </div>
            )}

            {error && (
                <div className="ai-error">
                    {error}
                </div>
            )}

            {answer && !loading && (
                <div className="ai-response">
                    <h2>AI Response</h2>

                    <div className="ai-answer">
                        {answer}
                    </div>
                </div>
            )}

        </div>
    );
}