import { useEffect, useState } from "react";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className="page">
      <h2><i className="fa fa-gear"></i> Settings</h2>

      <div style={{ marginTop: "20px" }}>
        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className="slider"></span>
        </label>
        <span style={{ marginLeft: "12px" }}>Night Mode</span>
      </div>
    </div>
  );
}