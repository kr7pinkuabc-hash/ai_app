import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);

    const navigate = useNavigate();


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (!username.trim() || !password.trim()) {
            setError("Please enter username and password.");
            return;
        }

        try {

            setLoading(true);

            await login(username, password);

            navigate("/home");

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="bg blur">

            <form
                className="card"
                onSubmit={handleSubmit}
            >

                <h2>Student Login</h2>

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && (
                    <p style={{ color: "red" }}>
                        {error}
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>

        </div>
    );
}