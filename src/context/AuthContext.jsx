import { createContext, useState } from "react";

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || (
    typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
        ? "http://localhost:5000"
        : "https://studysync-ai-f06n.onrender.com"
);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );

    // ------------------------------------------
    // LOGIN
    // ------------------------------------------

    const login = async (username, password) => {

        const response = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        const loggedInUser = {
            id: data.user.id,
            username: data.user.username,
            streak: data.streak
        };

        localStorage.setItem(
            "user",
            JSON.stringify(loggedInUser)
        );

        setUser(loggedInUser);

        return data;
    };


    // ------------------------------------------
    // SIGN UP
    // ------------------------------------------

    const signup = async (username, password) => {

        const response = await fetch(`${API_URL}/api/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Signup failed");
        }

        return data;
    };


    // ------------------------------------------
    // LOGOUT
    // ------------------------------------------

    const logout = () => {

        localStorage.removeItem("user");

        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                signup,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}