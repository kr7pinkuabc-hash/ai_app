import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {

    const [mode, setMode] = useState("login");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, signup } = useContext(AuthContext);

    const navigate = useNavigate();


    const clearMessages = () => {
        setError("");
        setMessage("");
    };


    const switchMode = (newMode) => {
        setMode(newMode);
        setUsername("");
        setPassword("");
        clearMessages();
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        clearMessages();

        if (!username.trim() || !password.trim()) {
            setError("Please enter username and password.");
            return;
        }

        try {

            setLoading(true);

            // -----------------------------
            // LOGIN
            // -----------------------------

            if (mode === "login") {

                await login(username, password);

                navigate("/home");
            }

            // -----------------------------
            // SIGN UP
            // -----------------------------

            else {

                await signup(username, password);

                setMessage(
                    "Account created successfully! You can now log in."
                );

                // Switch to login after successful signup
                setMode("login");

                setPassword("");
            }

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

                <h2>
                    {mode === "login"
                        ? "Student Login"
                        : "Create Student Account"}
                </h2>


                {/* LOGIN / SIGN UP TABS */}

                <div className="auth-tabs">

                    <button
                        type="button"
                        className={
                            mode === "login"
                                ? "auth-tab active"
                                : "auth-tab"
                        }
                        onClick={() => switchMode("login")}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        className={
                            mode === "signup"
                                ? "auth-tab active"
                                : "auth-tab"
                        }
                        onClick={() => switchMode("signup")}
                    >
                        Sign Up
                    </button>

                </div>


                {/* USERNAME */}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                />


                {/* PASSWORD */}

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={
                        mode === "login"
                            ? "current-password"
                            : "new-password"
                    }
                />


                {/* ERROR */}

                {error && (
                    <p className="auth-error">
                        {error}
                    </p>
                )}


                {/* SUCCESS */}

                {message && (
                    <p className="auth-success">
                        {message}
                    </p>
                )}


                {/* SUBMIT */}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? mode === "login"
                            ? "Logging in..."
                            : "Creating account..."
                        : mode === "login"
                            ? "Login"
                            : "Sign Up"
                    }
                </button>


                {/* BOTTOM MESSAGE */}

                <p className="auth-switch">

                    {mode === "login"
                        ? "New student? "
                        : "Already have an account? "
                    }

                    <button
                        type="button"
                        className="auth-link"
                        onClick={() =>
                            switchMode(
                                mode === "login"
                                    ? "signup"
                                    : "login"
                            )
                        }
                    >
                        {mode === "login"
                            ? "Sign Up"
                            : "Login"
                        }
                    </button>

                </p>

            </form>

        </div>
    );
}