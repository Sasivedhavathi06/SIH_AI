import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";

function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      alert("Please enter your full name");
      return;
    }

    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    if (!password) {
      alert("Please enter your password");
      return;
    }

    if (!confirmPassword) {
      alert("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    const student = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      topicsCompleted: 0,
      overallAccuracy: 0,
      learningStreak: 0,
      weakAreas: [],
      performance: [],
      assessments: [],
      learningProgress: []
    };

    localStorage.setItem("student", JSON.stringify(student));

    alert("Account created successfully!");

    navigate("/login");
  };

  return (
    <div className="learnai-signup-page">
      <div className="learnai-signup-card">

        <div className="learnai-signup-brand">
          <h1>LearnAI</h1>
          <p>AI-Powered Personalized Learning</p>
        </div>

        <div className="learnai-signup-heading">
          <h2>Create Account</h2>
          <p>Start your personalized learning journey</p>
        </div>

        <form onSubmit={handleSignup} autoComplete="off">

          <div className="learnai-signup-field">
            <label htmlFor="signup-full-name">
              Full Name
            </label>

            <input
              id="signup-full-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              autoComplete="off"
              name="signup-full-name"
            />
          </div>

          <div className="learnai-signup-field">
            <label htmlFor="signup-email">
              Email
            </label>

            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              autoComplete="off"
              name="signup-email"
            />
          </div>

          <div className="learnai-signup-field">
            <label htmlFor="signup-password">
              Password
            </label>

            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              autoComplete="new-password"
              name="signup-password"
            />
          </div>

          <div className="learnai-signup-field">
            <label htmlFor="signup-confirm-password">
              Confirm Password
            </label>

            <input
              id="signup-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              autoComplete="new-password"
              name="signup-confirm-password"
            />
          </div>

          <button
            type="submit"
            className="learnai-signup-button"
          >
            Create Account
          </button>

        </form>

        <div className="learnai-signup-footer">
          <span>Already have an account? </span>

          <button
            type="button"
            className="learnai-login-link"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>

      </div>
    </div>
  );
}

export default Signup;