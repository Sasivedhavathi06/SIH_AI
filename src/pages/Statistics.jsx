import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/statistics.css";

function Statistics() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [quizStats, setQuizStats] = useState({});

  useEffect(() => {
    const savedStudent = localStorage.getItem("student");
    if (!savedStudent) {
      navigate("/login");
      return;
    }

    const studentData = JSON.parse(savedStudent);
    setStudent(studentData);

    // Calculate detailed statistics
    const quizHistory = studentData.quizHistory || [];
    const topics = studentData.topics || {};

    const stats = {
      totalQuizzesTaken: quizHistory.length,
      averageScore: quizHistory.length > 0
        ? Math.round(quizHistory.reduce((sum, q) => sum + q.score, 0) / quizHistory.length)
        : 0,
      highestScore: quizHistory.length > 0 ? Math.max(...quizHistory.map((q) => q.score)) : 0,
      lowestScore: quizHistory.length > 0 ? Math.min(...quizHistory.map((q) => q.score)) : 0,
      passRate: quizHistory.length > 0
        ? Math.round((quizHistory.filter((q) => q.score >= 70).length / quizHistory.length) * 100)
        : 0,
      perfectScores: quizHistory.filter((q) => q.score === 100).length,
      topicsWithQuizzes: Object.keys(topics).length,
      strongTopics: Object.values(topics).filter((t) => t.score >= 80).length,
      weakTopics: Object.values(topics).filter((t) => t.score < 60).length,
      lastQuizDate: quizHistory.length > 0
        ? new Date(quizHistory[quizHistory.length - 1].date).toLocaleDateString()
        : "Never"
    };

    setQuizStats(stats);
  }, [navigate]);

  if (!student || !Object.keys(quizStats).length) {
    return (
      <div className="statistics-page">
        <Sidebar />
        <div style={{ padding: "40px", textAlign: "center" }}>Loading statistics...</div>
      </div>
    );
  }

  return (
    <>
      <Sidebar />

      <main className="statistics-page">
        <div className="statistics-header">
          <h1>📊 Detailed Statistics</h1>
          <p>Analyze your learning performance and progress</p>
        </div>

        <div className="statistics-container">
          {/* Main Stats Grid */}
          <div className="stats-grid-main">
            <div className="stat-box-large">
              <div className="stat-icon">📈</div>
              <div className="stat-content">
                <div className="stat-value">{quizStats.averageScore}%</div>
                <div className="stat-label">Average Score</div>
                <div className="stat-description">Based on {quizStats.totalQuizzesTaken} quizzes</div>
              </div>
            </div>

            <div className="stat-box-large">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <div className="stat-value">{quizStats.passRate}%</div>
                <div className="stat-label">Pass Rate</div>
                <div className="stat-description">Score 70% or above</div>
              </div>
            </div>

            <div className="stat-box-large">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-value">{quizStats.perfectScores}</div>
                <div className="stat-label">Perfect Scores</div>
                <div className="stat-description">Scored 100%</div>
              </div>
            </div>

            <div className="stat-box-large">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <div className="stat-value">{quizStats.topicsWithQuizzes}</div>
                <div className="stat-label">Topics Covered</div>
                <div className="stat-description">Active learning areas</div>
              </div>
            </div>
          </div>

          {/* Performance Range */}
          <div className="performance-section">
            <h2>📊 Score Range Analysis</h2>

            <div className="score-ranges">
              <div className="score-range">
                <div className="range-label">90-100% (Excellent)</div>
                <div className="range-bar">
                  <div
                    className="range-fill excellent"
                    style={{
                      width: `${Math.round(
                        ((student.quizHistory || []).filter((q) => q.score >= 90).length /
                          (student.quizHistory || []).length) *
                          100
                      )}%`
                    }}
                  />
                </div>
                <div className="range-count">
                  {(student.quizHistory || []).filter((q) => q.score >= 90).length} quizzes
                </div>
              </div>

              <div className="score-range">
                <div className="range-label">75-89% (Good)</div>
                <div className="range-bar">
                  <div
                    className="range-fill good"
                    style={{
                      width: `${Math.round(
                        ((student.quizHistory || []).filter((q) => q.score >= 75 && q.score < 90).length /
                          (student.quizHistory || []).length) *
                          100
                      )}%`
                    }}
                  />
                </div>
                <div className="range-count">
                  {(student.quizHistory || []).filter((q) => q.score >= 75 && q.score < 90).length} quizzes
                </div>
              </div>

              <div className="score-range">
                <div className="range-label">60-74% (Average)</div>
                <div className="range-bar">
                  <div
                    className="range-fill average"
                    style={{
                      width: `${Math.round(
                        ((student.quizHistory || []).filter((q) => q.score >= 60 && q.score < 75).length /
                          (student.quizHistory || []).length) *
                          100
                      )}%`
                    }}
                  />
                </div>
                <div className="range-count">
                  {(student.quizHistory || []).filter((q) => q.score >= 60 && q.score < 75).length} quizzes
                </div>
              </div>

              <div className="score-range">
                <div className="range-label">Below 60% (Needs Work)</div>
                <div className="range-bar">
                  <div
                    className="range-fill weak"
                    style={{
                      width: `${Math.round(
                        ((student.quizHistory || []).filter((q) => q.score < 60).length /
                          (student.quizHistory || []).length) *
                          100
                      )}%`
                    }}
                  />
                </div>
                <div className="range-count">
                  {(student.quizHistory || []).filter((q) => q.score < 60).length} quizzes
                </div>
              </div>
            </div>
          </div>

          {/* Topic Statistics */}
          <div className="topic-stats-section">
            <h2>🎯 Topic Performance</h2>

            <div className="topic-breakdown">
              <div className="topic-stat-card">
                <div className="topic-stat-number">{quizStats.strongTopics}</div>
                <div className="topic-stat-label">Strong Topics</div>
                <div className="topic-stat-desc">Score 80%+</div>
              </div>

              <div className="topic-stat-card">
                <div className="topic-stat-number">{quizStats.topicsWithQuizzes - quizStats.strongTopics - quizStats.weakTopics}</div>
                <div className="topic-stat-label">Average Topics</div>
                <div className="topic-stat-desc">Score 60-80%</div>
              </div>

              <div className="topic-stat-card">
                <div className="topic-stat-number">{quizStats.weakTopics}</div>
                <div className="topic-stat-label">Weak Topics</div>
                <div className="topic-stat-desc">Score below 60%</div>
              </div>
            </div>
          </div>

          {/* Quiz Details */}
          <div className="quiz-details-section">
            <h2>📋 Quiz Summary</h2>

            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-icon">📝</span>
                <span className="detail-label">Total Quizzes</span>
                <span className="detail-value">{quizStats.totalQuizzesTaken}</span>
              </div>

              <div className="detail-item">
                <span className="detail-icon">🏆</span>
                <span className="detail-label">Best Score</span>
                <span className="detail-value">{quizStats.highestScore}%</span>
              </div>

              <div className="detail-item">
                <span className="detail-icon">📉</span>
                <span className="detail-label">Lowest Score</span>
                <span className="detail-value">{quizStats.lowestScore}%</span>
              </div>

              <div className="detail-item">
                <span className="detail-icon">📅</span>
                <span className="detail-label">Last Quiz</span>
                <span className="detail-value">{quizStats.lastQuizDate}</span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="recommendations-box">
            <h2>💡 Insights & Recommendations</h2>

            <div className="insight-cards">
              {quizStats.passRate >= 80 ? (
                <div className="insight-card success">
                  <span>✅</span>
                  <div>
                    <strong>Excellent Performance!</strong>
                    <p>You're maintaining a high pass rate. Keep pushing for more challenges!</p>
                  </div>
                </div>
              ) : (
                <div className="insight-card warning">
                  <span>⚠️</span>
                  <div>
                    <strong>Focus on Improvement</strong>
                    <p>Your pass rate is {quizStats.passRate}%. Try to reach 80% through consistent practice.</p>
                  </div>
                </div>
              )}

              {quizStats.weakTopics > 0 ? (
                <div className="insight-card info">
                  <span>🎯</span>
                  <div>
                    <strong>Address Weak Topics</strong>
                    <p>You have {quizStats.weakTopics} topic(s) with scores below 60%. Review and practice these areas.</p>
                  </div>
                </div>
              ) : (
                <div className="insight-card success">
                  <span>🌟</span>
                  <div>
                    <strong>No Weak Topics!</strong>
                    <p>All your topics have scores above 60%. You're doing great!</p>
                  </div>
                </div>
              )}

              {quizStats.totalQuizzesTaken < 5 ? (
                <div className="insight-card info">
                  <span>📚</span>
                  <div>
                    <strong>Build Your History</strong>
                    <p>Complete more quizzes to establish comprehensive performance data and insights.</p>
                  </div>
                </div>
              ) : (
                <div className="insight-card success">
                  <span>📊</span>
                  <div>
                    <strong>Good Data Volume</strong>
                    <p>You have {quizStats.totalQuizzesTaken} quizzes completed. Continue learning regularly!</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Statistics;
