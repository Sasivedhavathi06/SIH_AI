import { NavLink, useNavigate } from "react-router-dom";
import "../styles/sidebar.css";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("student");
    localStorage.removeItem("studentName");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("learnai_api_key");
    localStorage.removeItem("learnai_chat_history");

    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        <h2>LearnAI</h2>
        <span>Smart Learning</span>
      </div>

      <nav>
        <NavLink to="/dashboard">🏠 Dashboard</NavLink>
        <NavLink to="/performance">📊 Performance</NavLink>
        <NavLink to="/weakness">🧠 Weakness Detection</NavLink>
        <NavLink to="/learning-path">🎯 Learning Path</NavLink>
        <NavLink to="/practice">📝 Practice</NavLink>
        <NavLink to="/resources">📚 Resources</NavLink>
        <NavLink to="/profile">👤 Profile</NavLink>
        <NavLink to="/leaderboard">🏆 Leaderboard</NavLink>
        <NavLink to="/study-planner">📅 Study Planner</NavLink>
        <NavLink to="/certificates">🎓 Certificates</NavLink>
        <NavLink to="/statistics">📈 Statistics</NavLink>
        <NavLink to="/ai-assistant">🤖 AI Assistant</NavLink>
      </nav>

      <div className="sidebar-logout">
        <button onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;