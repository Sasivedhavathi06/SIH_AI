import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const savedStudent = localStorage.getItem("student");
    const loggedIn = localStorage.getItem("loggedIn");

    if (!savedStudent) {
      navigate("/login");
      return;
    }

    try {
      const parsedStudent = JSON.parse(savedStudent);

      setStudent(parsedStudent);

      if (loggedIn !== "true") {
        localStorage.setItem("loggedIn", "true");
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      localStorage.removeItem("student");
      localStorage.removeItem("loggedIn");
      navigate("/login");
    }
  }, [navigate]);

  if (!student) {
    return (
      <div className="dashboard">
        <h2>Loading your personalized dashboard...</h2>
      </div>
    );
  }

  const studentName =
    student.fullName ||
    student.name ||
    student.username ||
    "Student";

  const currentHour = new Date().getHours();

  let greeting = "Good evening";

  if (currentHour < 12) {
    greeting = "Good morning";
  } else if (currentHour < 17) {
    greeting = "Good afternoon";
  }

  const topics = student.topics || {};
  const topicList = Object.entries(topics);

  const completedTopics = topicList.filter(
    ([, data]) => data.completed === true
  ).length;

  const totalTopics = topicList.length;

  const totalScore = topicList.reduce(
    (sum, [, data]) => sum + Number(data.score || 0),
    0
  );

  const overallAccuracy =
    totalTopics > 0
      ? Math.round(totalScore / totalTopics)
      : 0;

  const weakTopics = topicList.filter(
    ([, data]) => Number(data.score || 0) < 60
  );

  const strongTopics = topicList.filter(
    ([, data]) => Number(data.score || 0) >= 80
  );

  const mediumTopics = topicList.filter(
    ([, data]) =>
      Number(data.score || 0) >= 60 &&
      Number(data.score || 0) < 80
  );

  let recommendationTopic = "Take Your First Assessment";

  let recommendationMessage =
    "Complete an assessment so we can analyze your performance and create a personalized learning plan.";

  if (weakTopics.length > 0) {
    const weakestTopic = [...weakTopics].sort(
      (a, b) =>
        Number(a[1].score || 0) -
        Number(b[1].score || 0)
    )[0];

    recommendationTopic = weakestTopic[0];

    recommendationMessage =
      `Your current score is ${weakestTopic[1].score}%. ` +
      "This topic needs more practice based on your recent performance.";
  } else if (mediumTopics.length > 0) {
    recommendationTopic = mediumTopics[0][0];

    recommendationMessage =
      "You have a good foundation in this topic. More practice can help you improve further.";
  } else if (strongTopics.length > 0) {
    recommendationTopic = "Advanced Practice";

    recommendationMessage =
      "You are performing well. Try advanced questions to strengthen your knowledge.";
  }

  return (
    <div>
      <Sidebar />

      <main className="dashboard">

        {/* HEADER */}

        <div className="dashboard-header">
          <div>
            <h1>
              {greeting}, {studentName} 👋
            </h1>

            <p>
              Here's your personalized learning overview.
            </p>
          </div>

          <div className="profile-circle">
            {studentName.charAt(0).toUpperCase()}
          </div>
        </div>


        {/* STATISTICS */}

        <div className="stats-grid">

          <div className="stat-card">
            <span>📚</span>

            <h3>{completedTopics}</h3>

            <p>Topics Completed</p>
          </div>


          <div className="stat-card">
            <span>🎯</span>

            <h3>{overallAccuracy}%</h3>

            <p>Overall Accuracy</p>
          </div>


          <div className="stat-card">
            <span>🔥</span>

            <h3>
              {student.learningStreak || 0} Days
            </h3>

            <p>Learning Streak</p>
          </div>


          <div className="stat-card">
            <span>🧠</span>

            <h3>{weakTopics.length}</h3>

            <p>Weak Areas</p>
          </div>

        </div>


        {/* AI INSIGHTS + RECOMMENDATION */}

        <div className="dashboard-grid">

          {/* AI INSIGHTS */}

          <section className="panel">

            <h2>AI Learning Insights</h2>

            {topicList.length === 0 ? (

              <div className="empty-state">

                <div style={{ fontSize: "40px" }}>
                  🧠
                </div>

                <h3>
                  Your learning analysis will appear here
                </h3>

                <p>
                  Take your first assessment to allow
                  LearnAI to identify your strengths and
                  weaknesses.
                </p>

              </div>

            ) : (

              topicList.map(([topic, data]) => {

                const score = Number(data.score || 0);

                return (
                  <div
                    className="insight"
                    key={topic}
                  >

                    <div>
                      <h3>{topic}</h3>

                      <p>
                        {score < 60
                          ? "🔴 Needs improvement"
                          : score < 80
                          ? "🟡 Keep practicing"
                          : "🟢 You are performing well"}
                      </p>
                    </div>

                    <strong>
                      {score}%
                    </strong>

                  </div>
                );
              })
            )}

          </section>


          {/* PERSONALIZED RECOMMENDATION */}

          <section className="panel">

            <h2>Today's Recommendation</h2>

            <div className="recommendation">

              <span>🎯</span>

              <div>

                <h3>
                  {recommendationTopic}
                </h3>

                <p>
                  {recommendationMessage}
                </p>

                <button
                  onClick={() =>
                    navigate("/practice")
                  }
                >
                  Start Learning
                </button>

              </div>

            </div>

          </section>

        </div>


        {/* LEARNING PROGRESS */}

        <section className="panel progress-panel">

          <h2>Learning Progress</h2>

          {topicList.length === 0 ? (

            <div className="empty-state">

              <p>
                No assessment data available yet.
              </p>

              <button
                onClick={() =>
                  navigate("/practice")
                }
                className="primary-btn"
                style={{
                  marginTop: "15px",
                  width: "auto",
                  padding: "10px 20px"
                }}
              >
                Take Assessment
              </button>

            </div>

          ) : (

            topicList.map(([topic, data]) => {

              const score = Number(data.score || 0);

              return (
                <div
                  className="progress-item"
                  key={topic}
                >

                  <div>
                    <span>{topic}</span>

                    <strong>
                      {score}%
                    </strong>
                  </div>

                  <div className="progress-bar">

                    <div
                      style={{
                        width: `${Math.min(
                          Math.max(score, 0),
                          100
                        )}%`
                      }}
                    />

                  </div>

                </div>
              );
            })
          )}

        </section>


        {/* LEARNING SUMMARY */}

        <section className="panel">

          <h2>Learning Summary</h2>

          <div className="summary-grid">

            <div>
              <h3>{strongTopics.length}</h3>
              <p>Strong Topics</p>
            </div>

            <div>
              <h3>{mediumTopics.length}</h3>
              <p>Topics to Improve</p>
            </div>

            <div>
              <h3>{weakTopics.length}</h3>
              <p>Weak Topics</p>
            </div>

            <div>
              <h3>{totalTopics}</h3>
              <p>Total Topics</p>
            </div>

          </div>

        </section>

      </main>
    </div>
  );
}

export default Dashboard;