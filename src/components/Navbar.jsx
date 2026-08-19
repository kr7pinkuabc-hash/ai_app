import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <nav className="nav">
      <Link to="/home"><i className="fa fa-home"></i> Home</Link>
      <Link to="/attendance"><i className="fa fa-calendar"></i> Attendance</Link>
      <Link to="/profile"><i className="fa fa-user"></i> Profile</Link>
      <Link to="/about"><i className="fa fa-info-circle"></i> About</Link>
      <Link to="/settings"><i className="fa fa-gear"></i> Settings</Link>
      <Link to="/ai">
    <i className="fa fa-robot"></i> AI Assistant
</Link>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}