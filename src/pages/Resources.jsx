import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/learningpath.css";

const resourceMap = {
  Java: [
    { title: "Java Fundamentals", type: "Course", link: "https://www.w3schools.com/java/" },
    { title: "OOP Concepts", type: "Tutorial", link: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/" },
    { title: "Java Practice Set", type: "Practice", link: "https://www.hackerrank.com/domains/java" }
  ],
  "Data Structures": [
    { title: "DSA Crash Course", type: "Course", link: "https://www.geeksforgeeks.org/data-structures/" },
    { title: "Array & Linked List", type: "Guide", link: "https://www.programiz.com/dsa" },
    { title: "Problem Solving Practice", type: "Practice", link: "https://leetcode.com/problemset/all/" }
  ],
  DBMS: [
    { title: "SQL Tutorial", type: "Tutorial", link: "https://www.w3schools.com/sql/" },
    { title: "Database Design Basics", type: "Guide", link: "https://www.tutorialspoint.com/dbms/index.htm" },
    { title: "SQL Practice", type: "Practice", link: "https://www.hackerrank.com/domains/sql" }
  ],
  default: [
    { title: "Study Planning Guide", type: "Guide", link: "https://www.coursera.org/articles/study-plan" },
    { title: "Smart Revision Tips", type: "Worksheet", link: "https://www.student.com/blogs/study-tips" },
    { title: "Practice with Quizzes", type: "Practice", link: "https://www.khanacademy.org/" }
  ]
};

function Resources() {
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
      console.error("Resources error:", error);
      localStorage.removeItem("student");
      localStorage.removeItem("loggedIn");
      navigate("/login");
    }
  }, [navigate]);

  if (!student) {
    return (
      <div className="dashboard">
        <h2>Loading your study resources...</h2>
      </div>
    );
  }

  const topicList = Object.entries(student.topics || {});
  const weakTopics = topicList.filter(([, data]) => Number(data.score || 0) < 60);
  const prioritySubject = weakTopics.length > 0 ? weakTopics[0][1].subject : Object.keys(resourceMap)[0];
  const resources = resourceMap[prioritySubject] || resourceMap.default;

  return (
    <>
      <Sidebar />

      <main className="dashboard learning-path-page">
        <div className="learning-path-header">
          <div>
            <span className="page-label">STUDY MATERIALS</span>
            <h1>📚 Learning Resources</h1>
            <p>Recommended materials based on your current learning progress.</p>
          </div>
        </div>

        <section className="learning-panel">
          <div className="panel-title">
            <div>
              <span className="page-label">PERSONALIZED RECOMMENDATION</span>
              <h2>Focus on {prioritySubject}</h2>
            </div>
          </div>

          <div className="learning-roadmap">
            {resources.map((resource) => (
              <div className="roadmap-item" key={resource.title}>
                <div className="roadmap-number">✓</div>
                <div className="roadmap-content">
                  <div className="roadmap-header">
                    <div>
                      <h3>{resource.title}</h3>
                      <span className="topic-level level-medium">{resource.type}</span>
                    </div>
                  </div>

                  <div className="roadmap-steps">
                    <div className="roadmap-step">
                      <span>1</span>
                      <p>Review the key concepts and examples from the link.</p>
                    </div>
                    <div className="roadmap-step">
                      <span>2</span>
                      <p>Practice the exercises or quiz questions after reading.</p>
                    </div>
                  </div>

                  <a href={resource.link} target="_blank" rel="noreferrer">
                    <button className="roadmap-button" type="button">Open Resource</button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="learning-panel">
          <div className="panel-title">
            <div>
              <span className="page-label">STUDY PLAN</span>
              <h2>Next steps</h2>
            </div>
          </div>

          <ul className="ai-list">
            <li>Read one resource before your next practice session.</li>
            <li>Revisit the topic you scored lowest on and take a short quiz.</li>
            <li>Use the same resource again after a few days to check retention.</li>
            <li>Keep a short notes sheet for formulas, syntax, and common mistakes.</li>
          </ul>
        </section>
      </main>
    </>
  );
}

export default Resources;