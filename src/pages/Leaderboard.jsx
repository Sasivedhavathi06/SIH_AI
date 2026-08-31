import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/leaderboard.css";

function Leaderboard() {
  const [students, setStudents] = useState([]);
  const [sortBy, setSortBy] = useState("score");

  useEffect(() => {
    // Get current student and create mock leaderboard data
    const currentStudent = JSON.parse(localStorage.getItem("student") || "{}");
    
    const mockLeaderboard = [
      {
        rank: 1,
        name: "Alex Johnson",
        score: 92,
        topics: 8,
        streak: 15,
        badge: "🏆"
      },
      {
        rank: 2,
        name: "Sarah Williams",
        score: 88,
        topics: 7,
        streak: 12,
        badge: "🥈"
      },
      {
        rank: 3,
        name: "Michael Chen",
        score: 85,
        topics: 6,
        streak: 10,
        badge: "🥉"
      },
      {
        rank: 4,
        name: currentStudent.fullName || "You",
        score: currentStudent.topics
          ? Math.round(
              Object.values(currentStudent.topics).reduce((sum, t) => sum + (t.score || 0), 0) /
              Object.keys(currentStudent.topics).length
            )
          : 0,
        topics: currentStudent.topics ? Object.keys(currentStudent.topics).length : 0,
        streak: currentStudent.learningStreak || 0,
        badge: "👤",
        isCurrentUser: true
      },
      {
        rank: 5,
        name: "Emma Davis",
        score: 82,
        topics: 5,
        streak: 8,
        badge: "⭐"
      },
      {
        rank: 6,
        name: "David Wilson",
        score: 78,
        topics: 4,
        streak: 6,
        badge: "📚"
      },
      {
        rank: 7,
        name: "Jessica Martinez",
        score: 75,
        topics: 3,
        streak: 4,
        badge: "🌟"
      },
      {
        rank: 8,
        name: "James Taylor",
        score: 72,
        topics: 2,
        streak: 2,
        badge: "🎯"
      }
    ];

    setStudents(mockLeaderboard);
  }, []);

  const sortedStudents = [...students].sort((a, b) => {
    if (sortBy === "score") return b.score - a.score;
    if (sortBy === "topics") return b.topics - a.topics;
    if (sortBy === "streak") return b.streak - a.streak;
    return 0;
  });

  return (
    <>
      <Sidebar />

      <main className="leaderboard-page">
        <div className="leaderboard-header">
          <h1>🏆 Global Leaderboard</h1>
          <p>See how you rank among active learners worldwide</p>
        </div>

        <div className="leaderboard-container">
          <div className="leaderboard-filters">
            <button
              className={sortBy === "score" ? "filter-btn active" : "filter-btn"}
              onClick={() => setSortBy("score")}
            >
              📊 By Score
            </button>
            <button
              className={sortBy === "topics" ? "filter-btn active" : "filter-btn"}
              onClick={() => setSortBy("topics")}
            >
              📚 By Topics
            </button>
            <button
              className={sortBy === "streak" ? "filter-btn active" : "filter-btn"}
              onClick={() => setSortBy("streak")}
            >
              🔥 By Streak
            </button>
          </div>

          <div className="leaderboard-table">
            <div className="table-header">
              <div className="col-rank">Rank</div>
              <div className="col-name">Student</div>
              <div className="col-score">Score</div>
              <div className="col-topics">Topics</div>
              <div className="col-streak">Streak</div>
            </div>

            {sortedStudents.map((student, index) => (
              <div
                key={index}
                className={`table-row ${student.isCurrentUser ? "current-user" : ""} rank-${student.rank}`}
              >
                <div className="col-rank">
                  <span className="rank-badge">{student.badge}</span>
                </div>
                <div className="col-name">
                  <div className="student-info">
                    <span className="student-name">{student.name}</span>
                    {student.isCurrentUser && <span className="you-badge">YOU</span>}
                  </div>
                </div>
                <div className="col-score">
                  <span className={`score-value ${student.score >= 80 ? "excellent" : "good"}`}>
                    {student.score}%
                  </span>
                </div>
                <div className="col-topics">
                  <span className="topics-value">{student.topics}</span>
                </div>
                <div className="col-streak">
                  <span className="streak-value">🔥 {student.streak}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="leaderboard-stats">
            <div className="stat-box">
              <span>📊</span>
              <div>
                <p>Top Score</p>
                <strong>{sortedStudents[0]?.score}%</strong>
              </div>
            </div>

            <div className="stat-box">
              <span>🔥</span>
              <div>
                <p>Best Streak</p>
                <strong>{Math.max(...sortedStudents.map((s) => s.streak))} days</strong>
              </div>
            </div>

            <div className="stat-box">
              <span>📚</span>
              <div>
                <p>Most Topics</p>
                <strong>{Math.max(...sortedStudents.map((s) => s.topics))} topics</strong>
              </div>
            </div>

            <div className="stat-box">
              <span>👥</span>
              <div>
                <p>Active Learners</p>
                <strong>{sortedStudents.length}+</strong>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Leaderboard;
