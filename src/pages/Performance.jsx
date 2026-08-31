import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/performance.css";

function Performance() {
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
      console.error("Performance error:", error);
      localStorage.removeItem("student");
      localStorage.removeItem("loggedIn");
      navigate("/login");
    }
  }, [navigate]);

  if (!student) {
    return (
      <div className="dashboard">
        <h2>Loading your performance...</h2>
      </div>
    );
  }

  const topics = student.topics || {};
  const topicList = Object.entries(topics);

  const totalTopics = topicList.length;

  const completedTopics = topicList.filter(
    ([, data]) => data.completed === true
  ).length;

  const totalScore = topicList.reduce(
    (sum, [, data]) => sum + Number(data.score || 0),
    0
  );

  const overallAccuracy =
    totalTopics > 0
      ? Math.round(totalScore / totalTopics)
      : 0;

  const strongTopics = topicList.filter(
    ([, data]) => Number(data.score || 0) >= 80
  );

  const improvingTopics = topicList.filter(
    ([, data]) =>
      Number(data.score || 0) >= 60 &&
      Number(data.score || 0) < 80
  );

  const weakTopics = topicList.filter(
    ([, data]) => Number(data.score || 0) < 60
  );

  return (
    <>
      <Sidebar />

      <main className="dashboard performance-page">

        {/* HEADER */}

        <div className="performance-header">
          <div>
            <h1>📊 Performance Analysis</h1>

            <p>
              Analyze your academic performance and progress.
            </p>
          </div>

          <div className="performance-user">
            <span>Student</span>
            <strong>
              {student.fullName ||
                student.name ||
                student.username ||
                "Student"}
            </strong>
          </div>
        </div>


        {/* OVERVIEW CARDS */}

        <div className="performance-stats">

          <div className="performance-stat-card">
            <span>🎯</span>
            <h2>{overallAccuracy}%</h2>
            <p>Overall Accuracy</p>
          </div>

          <div className="performance-stat-card">
            <span>📚</span>
            <h2>{completedTopics}</h2>
            <p>Topics Completed</p>
          </div>

          <div className="performance-stat-card">
            <span>🟢</span>
            <h2>{strongTopics.length}</h2>
            <p>Strong Topics</p>
          </div>

          <div className="performance-stat-card">
            <span>🔴</span>
            <h2>{weakTopics.length}</h2>
            <p>Weak Topics</p>
          </div>

        </div>


        {/* PERFORMANCE OVERVIEW */}

        <section className="performance-panel">

          <h2>Performance Overview</h2>

          {topicList.length === 0 ? (

            <div className="performance-empty">

              <div className="performance-empty-icon">
                📊
              </div>

              <h3>No performance data yet</h3>

              <p>
                Complete a practice assessment to see
                your performance analysis here.
              </p>

              <button
                onClick={() => navigate("/practice")}
              >
                Start Practice
              </button>

            </div>

          ) : (

            <div className="topic-performance-list">

              {topicList.map(([topic, data]) => {

                const score = Math.min(
                  Math.max(Number(data.score || 0), 0),
                  100
                );

                let status = "Needs Improvement";
                let statusClass = "weak";

                if (score >= 80) {
                  status = "Strong";
                  statusClass = "strong";
                } else if (score >= 60) {
                  status = "Keep Practicing";
                  statusClass = "medium";
                }

                return (
                  <div
                    className="topic-performance"
                    key={topic}
                  >

                    <div className="topic-performance-top">

                      <div>
                        <h3>{topic}</h3>

                        <span className={`performance-status ${statusClass}`}>
                          {status}
                        </span>
                      </div>

                      <strong>
                        {score}%
                      </strong>

                    </div>

                    <div className="performance-progress">

                      <div
                        style={{
                          width: `${score}%`
                        }}
                      />

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </section>


        {/* PERFORMANCE CATEGORIES */}

        {topicList.length > 0 && (

          <div className="performance-category-grid">

            <section className="performance-panel">

              <h2>🟢 Strong Topics</h2>

              {strongTopics.length === 0 ? (

                <p className="category-empty">
                  No strong topics yet.
                </p>

              ) : (

                strongTopics.map(([topic, data]) => (

                  <div
                    className="category-item"
                    key={topic}
                  >
                    <span>{topic}</span>
                    <strong>
                      {Number(data.score || 0)}%
                    </strong>
                  </div>

                ))
              )}

            </section>


            <section className="performance-panel">

              <h2>🟡 Topics to Improve</h2>

              {improvingTopics.length === 0 ? (

                <p className="category-empty">
                  No topics in this range.
                </p>

              ) : (

                improvingTopics.map(([topic, data]) => (

                  <div
                    className="category-item"
                    key={topic}
                  >
                    <span>{topic}</span>
                    <strong>
                      {Number(data.score || 0)}%
                    </strong>
                  </div>

                ))
              )}

            </section>


            <section className="performance-panel">

              <h2>🔴 Weak Topics</h2>

              {weakTopics.length === 0 ? (

                <p className="category-empty">
                  Great! No weak topics detected.
                </p>

              ) : (

                weakTopics.map(([topic, data]) => (

                  <div
                    className="category-item"
                    key={topic}
                  >
                    <span>{topic}</span>
                    <strong>
                      {Number(data.score || 0)}%
                    </strong>
                  </div>

                ))
              )}

            </section>

          </div>
        )}


        {/* ACTION */}

        <section className="performance-action">

          <div>
            <h2>Want to improve your performance?</h2>

            <p>
              Practice your weak topics and build a
              stronger learning foundation.
            </p>
          </div>

          <button
            onClick={() => navigate("/practice")}
          >
            Practice Now
          </button>

        </section>

      </main>
    </>
  );
}

export default Performance;