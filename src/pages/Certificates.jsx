import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/certificates.css";

function Certificates() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const savedStudent = localStorage.getItem("student");
    if (!savedStudent) {
      navigate("/login");
      return;
    }

    const studentData = JSON.parse(savedStudent);
    setStudent(studentData);

    // Generate certificates for completed topics with score >= 70
    const certs = Object.entries(studentData.topics || {})
      .filter(([_, data]) => Number(data.score || 0) >= 70)
      .map(([topic, data], index) => ({
        id: index + 1,
        topic,
        subject: data.subject,
        score: data.score,
        completedDate: new Date(data.lastAttempt).toLocaleDateString(),
        level: data.score >= 85 ? "Distinguished" : data.score >= 75 ? "Proficient" : "Competent"
      }));

    setCertificates(certs);
  }, [navigate]);

  const handleDownloadCertificate = (cert) => {
    alert(`Certificate for "${cert.topic}" downloaded!\n\nThis would open a PDF in a real app.`);
  };

  const handleShareCertificate = (cert) => {
    alert(`Sharing certificate for "${cert.topic}"\n\nCertificate link copied to clipboard!`);
  };

  if (!student) {
    return (
      <div className="certificates-page">
        <Sidebar />
        <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Sidebar />

      <main className="certificates-page">
        <div className="certificates-header">
          <h1>🎓 Achievements & Certificates</h1>
          <p>Celebrate your learning milestones and accomplishments</p>
        </div>

        <div className="certificates-container">
          {/* Summary Stats */}
          <div className="certificate-stats">
            <div className="stat-card">
              <span>📜</span>
              <div>
                <strong>{certificates.length}</strong>
                <p>Certificates Earned</p>
              </div>
            </div>

            <div className="stat-card">
              <span>⭐</span>
              <div>
                <strong>
                  {certificates.filter((c) => c.level === "Distinguished").length}
                </strong>
                <p>Distinguished</p>
              </div>
            </div>

            <div className="stat-card">
              <span>🏅</span>
              <div>
                <strong>
                  {certificates.filter((c) => c.level === "Proficient").length}
                </strong>
                <p>Proficient</p>
              </div>
            </div>

            <div className="stat-card">
              <span>📋</span>
              <div>
                <strong>
                  {certificates.filter((c) => c.level === "Competent").length}
                </strong>
                <p>Competent</p>
              </div>
            </div>
          </div>

          {/* Certificates Display */}
          {certificates.length > 0 ? (
            <div className="certificates-grid">
              {certificates.map((cert) => (
                <div key={cert.id} className={`certificate-card level-${cert.level.toLowerCase()}`}>
                  <div className="certificate-content">
                    <div className="certificate-header-top">
                      <div className="cert-icon">📜</div>
                      <div className="cert-level">{cert.level}</div>
                    </div>

                    <div className="cert-body">
                      <h3>{cert.topic}</h3>
                      <p className="cert-subject">{cert.subject}</p>

                      <div className="cert-details">
                        <div>
                          <span>Score</span>
                          <strong>{cert.score}%</strong>
                        </div>
                        <div>
                          <span>Completed</span>
                          <strong>{cert.completedDate}</strong>
                        </div>
                      </div>

                      <div className="cert-footer">
                        <p className="cert-text">
                          Certificate of Achievement in {cert.topic}
                        </p>
                      </div>
                    </div>

                    <div className="certificate-actions">
                      <button
                        className="action-btn download-btn"
                        onClick={() => handleDownloadCertificate(cert)}
                      >
                        📥 Download
                      </button>
                      <button
                        className="action-btn share-btn"
                        onClick={() => handleShareCertificate(cert)}
                      >
                        📤 Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-certificates">
              <div className="empty-icon">📚</div>
              <h3>No Certificates Yet</h3>
              <p>
                Earn certificates by scoring 70% or above in practice quizzes. Keep learning and
                unlocking achievements!
              </p>
              <button className="start-learning-btn" onClick={() => navigate("/practice")}>
                Start Learning Now
              </button>
            </div>
          )}

          {/* Achievement Badges */}
          <div className="achievement-section">
            <h2>🏆 Achievement Badges</h2>

            <div className="badges-showcase">
              <div className={`badge ${certificates.length >= 1 ? "unlocked" : "locked"}`}>
                <div className="badge-icon">📜</div>
                <p>First Achievement</p>
              </div>

              <div className={`badge ${certificates.length >= 3 ? "unlocked" : "locked"}`}>
                <div className="badge-icon">🎖️</div>
                <p>Rising Scholar</p>
              </div>

              <div className={`badge ${certificates.length >= 5 ? "unlocked" : "locked"}`}>
                <div className="badge-icon">🏅</div>
                <p>Academic Excellence</p>
              </div>

              <div
                className={`badge ${
                  certificates.filter((c) => c.level === "Distinguished").length >= 2
                    ? "unlocked"
                    : "locked"
                }`}
              >
                <div className="badge-icon">⭐</div>
                <p>Distinguished Learner</p>
              </div>

              <div className={`badge ${certificates.length >= 10 ? "unlocked" : "locked"}`}>
                <div className="badge-icon">🎓</div>
                <p>Master Scholar</p>
              </div>

              <div
                className={`badge ${
                  certificates.filter((c) => c.score >= 90).length >= 2 ? "unlocked" : "locked"
                }`}
              >
                <div className="badge-icon">💎</div>
                <p>Perfect Score</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {certificates.length > 0 && certificates.length < 5 && (
            <div className="recommendation-banner">
              <span>💡</span>
              <div>
                <strong>Keep Going!</strong>
                <p>You're {5 - certificates.length} certificates away from the "Rising Scholar" badge!</p>
              </div>
              <button onClick={() => navigate("/practice")}>Take Another Quiz →</button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Certificates;
