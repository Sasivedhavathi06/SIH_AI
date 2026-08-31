import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/weakness.css";

function Weakness() {
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
      console.error("Weakness detection error:", error);
      localStorage.removeItem("student");
      localStorage.removeItem("loggedIn");
      navigate("/login");
    }
  }, [navigate]);

  if (!student) {
    return (
      <div className="dashboard">
        <h2>Analyzing your learning performance...</h2>
      </div>
    );
  }

  const topics = student.topics || {};
  const topicList = Object.entries(topics);

  const weakTopics = topicList.filter(
    ([, data]) => Number(data.score || 0) < 60
  );

  const improvingTopics = topicList.filter(
    ([, data]) => {
      const score = Number(data.score || 0);
      return score >= 60 && score < 80;
    }
  );

  const strongTopics = topicList.filter(
    ([, data]) => Number(data.score || 0) >= 80
  );

  const getSuggestion = (score) => {
    if (score < 40) {
      return "This topic requires focused practice. Start with the fundamentals and practice basic questions.";
    }

    if (score < 60) {
      return "You understand some concepts, but additional practice is needed to improve your accuracy.";
    }

    if (score < 80) {
      return "You have a good foundation. Regular practice can help you reach a stronger level.";
    }

    return "You are performing well. Try advanced questions to strengthen your knowledge.";
  };

  return (
    <>
      <Sidebar />

      <main className="dashboard weakness-page">

        {/* HEADER */}

        <div className="weakness-header">
          <div>
            <h1>🧠 Weakness Detection</h1>

            <p>
              AI identifies topics where you need improvement.
            </p>
          </div>

          <div className="weakness-user">
            <span>Learning Analysis For</span>

            <strong>
              {student.fullName ||
                student.name ||
                student.username ||
                "Student"}
            </strong>
          </div>
        </div>


        {/* OVERVIEW */}

        <div className="weakness-stats">

          <div className="weakness-stat-card">
            <span>🔴</span>

            <h2>{weakTopics.length}</h2>

            <p>Weak Topics</p>
          </div>

          <div className="weakness-stat-card">
            <span>🟡</span>

            <h2>{improvingTopics.length}</h2>

            <p>Needs Improvement</p>
          </div>

          <div className="weakness-stat-card">
            <span>🟢</span>

            <h2>{strongTopics.length}</h2>

            <p>Strong Topics</p>
          </div>

          <div className="weakness-stat-card">
            <span>📚</span>

            <h2>{topicList.length}</h2>

            <p>Total Topics</p>
          </div>

        </div>


        {/* NO DATA */}

        {topicList.length === 0 ? (

          <section className="weakness-panel weakness-empty">

            <div className="weakness-empty-icon">
              🧠
            </div>

            <h2>Not enough data yet</h2>

            <p>
              Complete a practice assessment first. LearnAI
              will analyze your results and identify the topics
              that need more attention.
            </p>

            <button
              onClick={() => navigate("/practice")}
            >
              Start Practice
            </button>

          </section>

        ) : (

          <>

            {/* WEAK TOPICS */}

            <section className="weakness-panel">

              <div className="section-heading">
                <div>
                  <h2>🔴 Weak Topics</h2>

                  <p>
                    Topics where your current performance
                    is below 60%.
                  </p>
                </div>
              </div>

              {weakTopics.length === 0 ? (

                <div className="no-weakness">
                  <span>🎉</span>

                  <div>
                    <h3>No critical weaknesses detected</h3>

                    <p>
                      Great work! Keep practicing to maintain
                      your current performance.
                    </p>
                  </div>
                </div>

              ) : (

                <div className="weakness-list">

                  {weakTopics.map(([topic, data]) => {

                    const score = Number(data.score || 0);

                    return (
                      <div
                        className="weakness-card"
                        key={topic}
                      >

                        <div className="weakness-card-header">

                          <div>
                            <h3>{topic}</h3>

                            <span>
                              Needs Attention
                            </span>
                          </div>

                          <strong>
                            {score}%
                          </strong>

                        </div>

                        <div className="weakness-progress">

                          <div
                            style={{
                              width: `${Math.min(
                                Math.max(score, 0),
                                100
                              )}%`
                            }}
                          />

                        </div>

                        <p>
                          {getSuggestion(score)}
                        </p>

                        <button
                          onClick={() => navigate("/practice")}
                        >
                          Practice This Topic
                        </button>

                      </div>
                    );
                  })}

                </div>
              )}

            </section>


            {/* IMPROVING TOPICS */}

            <section className="weakness-panel">

              <h2>🟡 Topics to Improve</h2>

              <p className="panel-description">
                You have a foundation in these topics, but
                additional practice can improve your results.
              </p>

              {improvingTopics.length === 0 ? (

                <p className="no-data-text">
                  No topics currently fall into this range.
                </p>

              ) : (

                <div className="improving-list">

                  {improvingTopics.map(([topic, data]) => {

                    const score = Number(data.score || 0);

                    return (
                      <div
                        className="improving-item"
                        key={topic}
                      >

                        <div>
                          <h3>{topic}</h3>

                          <p>
                            Keep practicing to reach 80%+
                          </p>
                        </div>

                        <strong>
                          {score}%
                        </strong>

                      </div>
                    );
                  })}

                </div>
              )}

            </section>


            {/* STRONG TOPICS */}

            <section className="weakness-panel">

              <h2>🟢 Strong Topics</h2>

              <p className="panel-description">
                Topics where you are currently performing
                well.
              </p>

              {strongTopics.length === 0 ? (

                <p className="no-data-text">
                  Complete more assessments to identify
                  your strongest topics.
                </p>

              ) : (

                <div className="strong-list">

                  {strongTopics.map(([topic, data]) => {

                    const score = Number(data.score || 0);

                    return (
                      <div
                        className="strong-item"
                        key={topic}
                      >

                        <div>
                          <h3>{topic}</h3>

                          <p>
                            Excellent performance
                          </p>
                        </div>

                        <strong>
                          {score}%
                        </strong>

                      </div>
                    );
                  })}

                </div>
              )}

            </section>


            {/* AI RECOMMENDATION */}

            <section className="ai-recommendation">

              <div className="ai-icon">
                🤖
              </div>

              <div>

                <h2>AI Learning Recommendation</h2>

                {weakTopics.length > 0 ? (

                  <p>
                    Based on your current performance,
                    focus more on{" "}
                    <strong>
                      {weakTopics[0][0]}
                    </strong>
                    . Practice regularly and review the
                    fundamental concepts before moving to
                    advanced questions.
                  </p>

                ) : improvingTopics.length > 0 ? (

                  <p>
                    Your performance is developing well.
                    Focus on{" "}
                    <strong>
                      {improvingTopics[0][0]}
                    </strong>
                    {" "}to move from an intermediate level
                    to a strong level.
                  </p>

                ) : (

                  <p>
                    Excellent work! Your current results
                    show strong performance. Try advanced
                    practice questions to challenge yourself.
                  </p>

                )}

              </div>

            </section>

          </>
        )}

      </main>
    </>
  );
}

export default Weakness;