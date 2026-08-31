import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/learningpath.css";

function LearningPath() {
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
      console.error("Learning path error:", error);
      localStorage.removeItem("student");
      localStorage.removeItem("loggedIn");
      navigate("/login");
    }
  }, [navigate]);

  if (!student) {
    return (
      <div className="dashboard">
        <h2>Creating your personalized learning path...</h2>
      </div>
    );
  }

  const topics = student.topics || {};
  const topicList = Object.entries(topics);

  const sortedTopics = [...topicList].sort(
    (a, b) =>
      Number(a[1].score || 0) -
      Number(b[1].score || 0)
  );

  const weakTopics = sortedTopics.filter(
    ([, data]) => Number(data.score || 0) < 60
  );

  const improvingTopics = sortedTopics.filter(
    ([, data]) => {
      const score = Number(data.score || 0);
      return score >= 60 && score < 80;
    }
  );

  const strongTopics = sortedTopics.filter(
    ([, data]) => Number(data.score || 0) >= 80
  );

  const studentName =
    student.fullName ||
    student.name ||
    student.username ||
    "Student";

  const getLevel = (score) => {
    if (score < 40) return "Beginner";
    if (score < 60) return "Foundation";
    if (score < 80) return "Intermediate";
    return "Advanced";
  };

  const getSteps = (score) => {
    if (score < 40) {
      return [
        "Review the fundamental concepts",
        "Study beginner-level learning resources",
        "Practice basic questions",
        "Take a topic assessment"
      ];
    }

    if (score < 60) {
      return [
        "Review important concepts",
        "Study recommended resources",
        "Practice topic-based questions",
        "Retake the assessment"
      ];
    }

    if (score < 80) {
      return [
        "Review concepts you missed",
        "Practice intermediate questions",
        "Solve application-based problems",
        "Aim for 80%+ accuracy"
      ];
    }

    return [
      "Review advanced concepts",
      "Attempt challenging problems",
      "Practice real-world applications",
      "Maintain your performance"
    ];
  };

  return (
    <>
      <Sidebar />

      <main className="dashboard learning-path-page">

        {/* HEADER */}

        <div className="learning-path-header">

          <div>
            <span className="page-label">
              PERSONALIZED LEARNING
            </span>

            <h1>🎯 Your Learning Path</h1>

            <p>
              A personalized learning journey created for{" "}
              <strong>{studentName}</strong> based on your
              current performance.
            </p>
          </div>

          <div className="learning-level-card">
            <span>Your Learning Level</span>

            <strong>
              {overallLevel(topicList)}
            </strong>
          </div>

        </div>


        {/* PROGRESS SUMMARY */}

        <div className="learning-summary">

          <div className="learning-summary-card">
            <span>🔴</span>
            <div>
              <strong>{weakTopics.length}</strong>
              <p>Priority Topics</p>
            </div>
          </div>

          <div className="learning-summary-card">
            <span>🟡</span>
            <div>
              <strong>{improvingTopics.length}</strong>
              <p>Improving Topics</p>
            </div>
          </div>

          <div className="learning-summary-card">
            <span>🟢</span>
            <div>
              <strong>{strongTopics.length}</strong>
              <p>Strong Topics</p>
            </div>
          </div>

          <div className="learning-summary-card">
            <span>📚</span>
            <div>
              <strong>{topicList.length}</strong>
              <p>Total Topics</p>
            </div>
          </div>

        </div>


        {/* NO DATA */}

        {topicList.length === 0 ? (

          <section className="learning-empty">

            <div className="learning-empty-icon">
              🎯
            </div>

            <h2>Your personalized path starts here</h2>

            <p>
              Complete your first practice assessment and
              LearnAI will create a learning path based on
              your strengths and weaknesses.
            </p>

            <button
              onClick={() => navigate("/practice")}
            >
              Start Assessment
            </button>

          </section>

        ) : (

          <>

            {/* PRIORITY TOPIC */}

            <section className="learning-panel priority-panel">

              <div className="panel-title">

                <div>
                  <span className="priority-label">
                    NEXT RECOMMENDED
                  </span>

                  <h2>Focus on Your Priority Topic</h2>

                  <p>
                    Start with the topic that currently
                    needs the most attention.
                  </p>
                </div>

              </div>

              {sortedTopics.length > 0 && (

                <div className="priority-topic">

                  <div className="priority-topic-info">

                    <div className="topic-icon">
                      🎯
                    </div>

                    <div>
                      <h3>
                        {sortedTopics[0][0]}
                      </h3>

                      <span>
                        Current Level:{" "}
                        {getLevel(
                          Number(
                            sortedTopics[0][1].score || 0
                          )
                        )}
                      </span>
                    </div>

                  </div>

                  <div className="priority-score">

                    <strong>
                      {Number(
                        sortedTopics[0][1].score || 0
                      )}%
                    </strong>

                    <span>Current Score</span>

                  </div>

                  <button
                    onClick={() => navigate("/practice")}
                  >
                    Start Practice
                  </button>

                </div>
              )}

            </section>


            {/* PERSONALIZED PATH */}

            <section className="learning-panel">

              <div className="panel-title">

                <div>
                  <span className="page-label">
                    YOUR JOURNEY
                  </span>

                  <h2>Personalized Learning Roadmap</h2>

                  <p>
                    Follow these steps to improve your
                    performance topic by topic.
                  </p>
                </div>

              </div>

              <div className="learning-roadmap">

                {sortedTopics.map(
                  ([topic, data], index) => {

                    const score = Math.min(
                      Math.max(
                        Number(data.score || 0),
                        0
                      ),
                      100
                    );

                    const steps = getSteps(score);

                    return (
                      <div
                        className="roadmap-item"
                        key={topic}
                      >

                        <div className="roadmap-number">
                          {index + 1}
                        </div>

                        <div className="roadmap-content">

                          <div className="roadmap-header">

                            <div>
                              <h3>{topic}</h3>

                              <span
                                className={`topic-level ${
                                  score < 60
                                    ? "level-weak"
                                    : score < 80
                                    ? "level-medium"
                                    : "level-strong"
                                }`}
                              >
                                {getLevel(score)}
                              </span>
                            </div>

                            <strong>
                              {score}%
                            </strong>

                          </div>

                          <div className="roadmap-progress">

                            <div
                              style={{
                                width: `${score}%`
                              }}
                            />

                          </div>

                          <div className="roadmap-steps">

                            {steps.map(
                              (step, stepIndex) => (

                                <div
                                  className="roadmap-step"
                                  key={stepIndex}
                                >

                                  <span>
                                    {stepIndex + 1}
                                  </span>

                                  <p>{step}</p>

                                </div>

                              )
                            )}

                          </div>

                          <button
                            className="roadmap-button"
                            onClick={() =>
                              navigate("/practice")
                            }
                          >
                            Practice {topic}
                          </button>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </section>


            {/* AI RECOMMENDATION */}

            <section className="learning-ai-card">

              <div className="learning-ai-icon">
                🤖
              </div>

              <div className="learning-ai-content">

                <span>AI LEARNING ASSISTANT</span>

                <h2>
                  Your Recommended Strategy
                </h2>

                <p>
                  {weakTopics.length > 0
                    ? `Focus first on ${weakTopics[0][0]}. Build a strong foundation, practice regularly, and then move to the next topic.`
                    : improvingTopics.length > 0
                    ? `Continue improving ${improvingTopics[0][0]} while maintaining your strong topics through regular practice.`
                    : "Excellent work! You are performing strongly. Challenge yourself with advanced questions and real-world problems."}
                </p>

                <button
                  onClick={() => navigate("/practice")}
                >
                  Continue Learning →
                </button>

              </div>

            </section>

          </>
        )}

      </main>
    </>
  );
}

function overallLevel(topicList) {
  if (topicList.length === 0) {
    return "Getting Started";
  }

  const totalScore = topicList.reduce(
    (sum, [, data]) =>
      sum + Number(data.score || 0),
    0
  );

  const average = totalScore / topicList.length;

  if (average < 40) {
    return "Beginner";
  }

  if (average < 60) {
    return "Foundation";
  }

  if (average < 80) {
    return "Intermediate";
  }

  return "Advanced";
}

export default LearningPath;