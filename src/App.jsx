import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Home from "./components/Home";
import Attendance from "./components/Attendance";
import Profile from "./components/Profile";
import About from "./components/About";
import Settings from "./components/Settings";
import AI from "./components/AI";
import Syllabus from "./components/Syllabus";
export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/ai" element={<AI />} />
        <Route path="/syllabus" element={<Syllabus />} />
      </Routes>
    </AuthProvider>
  );
}