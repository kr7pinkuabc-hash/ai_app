import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || (
    typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
        ? "http://localhost:5000"
        : "https://studysync-ai-f06n.onrender.com"
);

export default function Attendance() {

    const { user } = useContext(AuthContext);

    const [streak, setStreak] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        const fetchAttendance = async () => {

            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {

                const response = await fetch(`${API_URL}/api/attendance/${user.id}`);

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load attendance."
                    );
                }

                setStreak(data.streak);

            } catch (error) {

                setError(error.message);

            } finally {

                setLoading(false);
            }
        };


        fetchAttendance();

    }, [user?.id]);


    if (loading) {
        return (
            <div className="page">
                <h2>Your Attendance</h2>
                <p>Loading...</p>
            </div>
        );
    }


    if (error) {
        return (
            <div className="page">
                <h2>Your Attendance</h2>
                <p>{error}</p>
            </div>
        );
    }


    return (
        <div className="page">

            {/* <h2>Your Attendance</h2> */}

            {/* <p>Present: 85%</p> */}

            <div className="streak-card">

                <h3>🔥 Login Streak</h3>

                <p className="streak-number">
                    {streak} {streak === 1 ? "Day" : "Days"}
                </p>

                {streak === 0 ? (
                    <p>
                        Your streak has ended.
                        Login today to start a new streak.
                    </p>
                ) : (
                    <p>
                        Keep logging in every day to maintain your streak!
                    </p>
                )}

            </div>

        </div>
    );
}