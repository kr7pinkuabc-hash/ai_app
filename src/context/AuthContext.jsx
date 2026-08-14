import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const login = (username, password) => {
    const saved = JSON.parse(localStorage.getItem("credentials"));

    if (!saved) {
      localStorage.setItem(
        "credentials",
        JSON.stringify({ username, password })
      );
    }

    localStorage.setItem("user", JSON.stringify({ username }));
    setUser({ username });
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}