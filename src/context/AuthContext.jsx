import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user"))
    );

    const login = async (username, password) => {

        const response = await fetch("http://localhost:5000/api/login", {
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


    const logout = () => {

        localStorage.removeItem("user");

        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}