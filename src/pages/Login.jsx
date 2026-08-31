import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    if (!password) {
      alert("Please enter your password");
      return;
    }

    const savedStudent = JSON.parse(localStorage.getItem("student") || "null");

    if (!savedStudent) {
      alert("No account found. Please create an account first.");
      navigate("/signup");
      return;
    }

    const savedEmail = String(savedStudent.email || "").toLowerCase();
    const savedPassword = savedStudent.password || "";

    if (savedEmail !== email.trim().toLowerCase() || savedPassword !== password) {
      alert("Invalid email or password. Please try again.");
      return;
    }

    localStorage.setItem("loggedIn", "true");
    navigate("/dashboard");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>LearnAI</h1>
          <p>AI-Powered Personalized Learning</p>
        </div>

        <h2>Welcome back</h2>
        <p>Sign in to continue your learning journey.</p>

        <form onSubmit={handleLogin} autoComplete="off">
          <div>
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="off"
              name="login-email"
            />
          </div>

          <div>
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="off"
              name="login-password"
            />
          </div>

          <button type="submit">Login</button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account? </span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/signup");
            }}
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;
