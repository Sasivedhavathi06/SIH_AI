import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/profile.css";

function Profile() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const savedStudent = localStorage.getItem("student");

    if (!savedStudent) {
      navigate("/login");
      return;
    }

    try {
      setStudent(JSON.parse(savedStudent));
    } catch (error) {
      console.error("Profile error:", error);
      localStorage.removeItem("student");
      localStorage.removeItem("loggedIn");
      navigate("/login");
    }
  }, [navigate]);

  if (!student) {
    return (
      <div className="profile-page">
        <Sidebar />
        <div className="profile-content">
          <p style={{ textAlign: "center", color: "#64748b" }}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  const topicList = Object.entries(student.topics || {});
  const quizHistory = student.quizHistory || [];

  const averageScore =
    topicList.length > 0
      ? Math.round(
          topicList.reduce((sum, [, data]) => sum + Number(data.score || 0), 0) /
            topicList.length
        )
      : 0;

  const weakTopics = topicList.filter(([, data]) => Number(data.score || 0) < 60).length;
  const strongTopics = topicList.filter(([, data]) => Number(data.score || 0) >= 80).length;

  const getStatusLabel = () => {
    if (averageScore >= 80) return "Excellent Progress 🚀";
    if (averageScore >= 60) return "On Track 📈";
    return "Keep Practicing 💪";
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return "excellent";
    if (score >= 60) return "good";
    return "weak";
  };

  const recentQuizzes = quizHistory.slice(-5).reverse();

  // Calculate performance trends
  const performanceTrend = () => {
    if (quizHistory.length < 2) return "new";
    const recent = quizHistory.slice(-5).map((q) => q.score);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const older = quizHistory.slice(0, -5);
    if (older.length === 0) return "stable";
    const oldAvg = older.reduce((sum, q) => sum + q.score, 0) / older.length;
    return avg > oldAvg ? "improving" : avg < oldAvg ? "declining" : "stable";
  };

  // Get subject-wise performance
  const subjectPerformance = () => {
    const subjects = {};
    topicList.forEach(([topic, data]) => {
      const subject = data.subject || "Other";
      if (!subjects[subject]) {
        subjects[subject] = { scores: [], count: 0 };
      }
      subjects[subject].scores.push(Number(data.score || 0));
      subjects[subject].count++;
    });

    return Object.entries(subjects).map(([name, data]) => ({
      name,
      average: Math.round(
        data.scores.reduce((a, b) => a + b, 0) / data.scores.length
      ),
      count: data.count
    }));
  };

  // Calculate study stats
  const calculateStudyStats = () => {
    const totalAttempts = quizHistory.length;
    const avgTimePerQuiz = totalAttempts > 0 ? "~15 min" : "0 min";
    const bestScore = totalAttempts > 0 ? Math.max(...quizHistory.map((q) => q.score)) : 0;
    return { totalAttempts, avgTimePerQuiz, bestScore };
  };

  // Unlock badges
  const getBadges = () => {
    const badges = [];
    if (averageScore >= 80) badges.push({ icon: "⭐", name: "Excellence", desc: "Avg score 80%+" });
    if (topicList.length >= 5) badges.push({ icon: "🎓", name: "Scholar", desc: "Mastered 5 topics" });
    if (student.learningStreak >= 7) badges.push({ icon: "🔥", name: "On Fire", desc: "7 day streak" });
    if (strongTopics >= 3) badges.push({ icon: "🏆", name: "Expert", desc: "3+ strong topics" });
    return badges;
  };

  // Get next recommended topics
  const getRecommendations = () => {
    const recommendations = [];
    if (weakTopics > 0) {
      recommendations.push({
        type: "focus",
        text: `Focus on ${weakTopics} weak topic(s) to improve overall score`
      });
    }
    if (averageScore < 70) {
      recommendations.push({
        type: "practice",
        text: "Take more adaptive quizzes to build confidence"
      });
    }
    if (student.learningStreak < 7) {
      recommendations.push({
        type: "streak",
        text: `Keep going! ${7 - (student.learningStreak || 0)} more days to unlock 7-day badge`
      });
    }
    return recommendations.length > 0 ? recommendations : [{type: "congrats", text: "You're doing great! Keep learning!"}];
  };

  const studyStats = calculateStudyStats();
  const subjectData = subjectPerformance();
  const badges = getBadges();
  const recommendations = getRecommendations();
  const trend = performanceTrend();

  return (
    <>
      <Sidebar />

      <main className="profile-page">
        <div className="profile-header">
          <div className="profile-cover">
            <div className="profile-cover-overlay" />
          </div>

          <div className="profile-info-section">
            <div className="profile-hero">
              <div className="profile-avatar-large">
                {(student.fullName || student.name || "S").charAt(0).toUpperCase()}
              </div>

              <div className="profile-identity">
                <h1>{student.fullName || student.name || "Student"}</h1>
                <p>{student.email || "No email added"}</p>
                <div className="profile-status-badge">
                  {getStatusLabel()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-content">
          {/* Stats Grid */}
          <div className="profile-stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-value">{averageScore}%</div>
              <div className="stat-label">Average Score</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔴</div>
              <div className="stat-value">{weakTopics}</div>
              <div className="stat-label">Weak Topics</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-value">{strongTopics}</div>
              <div className="stat-label">Strong Topics</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-value">{topicList.length}</div>
              <div className="stat-label">Topics Covered</div>
            </div>
          </div>

          {/* Account Details */}
          <div className="profile-section">
            <div className="section-title">
              <h2>📋 Account Details</h2>
            </div>

            <div className="profile-details-grid">
              <div className="detail-item">
                <div className="detail-label">Full Name</div>
                <div className="detail-value">{student.fullName || student.name || "Not set"}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Email Address</div>
                <div className="detail-value">{student.email || "Not provided"}</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Learning Streak</div>
                <div className="detail-value">{student.learningStreak || 0} days 🔥</div>
              </div>

              <div className="detail-item">
                <div className="detail-label">Progress Status</div>
                <div className="detail-value">
                  {averageScore >= 80 ? "Excellent 🌟" : averageScore >= 60 ? "On Track 📈" : "Needs Attention ⚠️"}
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="profile-section">
            <div className="section-title">
              <h2>🏆 Achievements</h2>
            </div>

            <div className="achievement-grid">
              <div className="achievement-card">
                <div className="achievement-icon">🎯</div>
                <div className="achievement-name">Topic Master</div>
                <div className="achievement-desc">Covered {topicList.length}+ topics</div>
              </div>

              <div className="achievement-card">
                <div className="achievement-icon">⚡</div>
                <div className="achievement-name">Consistency</div>
                <div className="achievement-desc">Maintain {student.learningStreak || 0} day streak</div>
              </div>

              <div className="achievement-card">
                <div className="achievement-icon">🚀</div>
                <div className="achievement-name">Performance</div>
                <div className="achievement-desc">Average score {averageScore}%</div>
              </div>
            </div>
          </div>

          {/* Study Statistics */}
          <div className="profile-section">
            <div className="section-title">
              <h2>📊 Study Statistics</h2>
            </div>

            <div className="stats-cards-horizontal">
              <div className="stat-card-horizontal">
                <div className="stat-icon-small">📝</div>
                <div>
                  <div className="stat-value-small">{studyStats.totalAttempts}</div>
                  <div className="stat-label-small">Total Attempts</div>
                </div>
              </div>

              <div className="stat-card-horizontal">
                <div className="stat-icon-small">⏱️</div>
                <div>
                  <div className="stat-value-small">{studyStats.avgTimePerQuiz}</div>
                  <div className="stat-label-small">Avg Time</div>
                </div>
              </div>

              <div className="stat-card-horizontal">
                <div className="stat-icon-small">🎯</div>
                <div>
                  <div className="stat-value-small">{studyStats.bestScore}%</div>
                  <div className="stat-label-small">Best Score</div>
                </div>
              </div>

              <div className="stat-card-horizontal">
                <div className="stat-icon-small">{trend === "improving" ? "📈" : trend === "declining" ? "📉" : "➡️"}</div>
                <div>
                  <div className="stat-value-small" style={{color: trend === "improving" ? "#16a34a" : trend === "declining" ? "#dc2626" : "#2563eb"}}>
                    {trend === "improving" ? "Improving" : trend === "declining" ? "Declining" : "Stable"}
                  </div>
                  <div className="stat-label-small">Trend</div>
                </div>
              </div>
            </div>
          </div>

          {/* Subject Progress Breakdown */}
          {subjectData.length > 0 && (
            <div className="profile-section">
              <div className="section-title">
                <h2>📚 Subject Progress</h2>
              </div>

              <div className="subject-progress-grid">
                {subjectData.map((subject, index) => (
                  <div className="subject-card" key={index}>
                    <div className="subject-header">
                      <span className="subject-name">{subject.name}</span>
                      <span className="subject-badge">{subject.count} topics</span>
                    </div>

                    <div className="progress-bar-container">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${subject.average}%`,
                            backgroundColor:
                              subject.average >= 80
                                ? "#16a34a"
                                : subject.average >= 60
                                ? "#eab308"
                                : "#ef4444"
                          }}
                        />
                      </div>
                      <div className="progress-label">{subject.average}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Badges & Milestones */}
          <div className="profile-section">
            <div className="section-title">
              <h2>🏅 Badges & Milestones</h2>
            </div>

            {badges.length > 0 ? (
              <div className="badges-grid">
                {badges.map((badge, index) => (
                  <div className="badge-card unlocked" key={index}>
                    <div className="badge-icon">{badge.icon}</div>
                    <div className="badge-name">{badge.name}</div>
                    <div className="badge-desc">{badge.desc}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No badges unlocked yet. Keep learning to unlock achievements!</p>
              </div>
            )}
          </div>

          {/* Learning Recommendations */}
          <div className="profile-section">
            <div className="section-title">
              <h2>💡 Personalized Recommendations</h2>
            </div>

            <div className="recommendations-list">
              {recommendations.map((rec, index) => (
                <div className={`recommendation-item ${rec.type}`} key={index}>
                  <div className="recommendation-icon">
                    {rec.type === "focus" && "🎯"}
                    {rec.type === "practice" && "💪"}
                    {rec.type === "streak" && "🔥"}
                    {rec.type === "congrats" && "🎉"}
                  </div>
                  <p>{rec.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          {recentQuizzes.length > 0 && (
            <div className="profile-section">
              <div className="section-title">
                <h2>📝 Recent Learning Activity</h2>
              </div>

              <div className="learning-history">
                {recentQuizzes.map((quiz, index) => (
                  <div className="history-item" key={index}>
                    <div className="history-topic">
                      <div className="history-topic-name">{quiz.topic}</div>
                      <div className="history-topic-subject">{quiz.subject}</div>
                    </div>
                    <div className="history-score">
                      <span className={`score-badge ${getScoreBadgeClass(quiz.score)}`}>
                        {quiz.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="profile-action-bar">
                <button className="action-btn action-btn-primary" onClick={() => navigate("/practice")}>
                  📝 Continue Learning
                </button>
                <button className="action-btn action-btn-secondary" onClick={() => navigate("/dashboard")}>
                  📊 View Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {recentQuizzes.length === 0 && (
            <div className="profile-section">
              <div className="section-title">
                <h2>🚀 Get Started</h2>
              </div>
              <p style={{ color: "#64748b", marginBottom: "20px" }}>
                Begin your learning journey by taking a practice quiz and tracking your progress!
              </p>
              <div className="profile-action-bar">
                <button className="action-btn action-btn-primary" onClick={() => navigate("/practice")}>
                  📝 Start Practice
                </button>
                <button className="action-btn action-btn-secondary" onClick={() => navigate("/learning-path")}>
                  🗺️ View Learning Path
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Profile;