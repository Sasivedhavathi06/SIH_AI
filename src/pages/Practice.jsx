import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/practice.css";

const questionBank = {
  Java: {
    "Java Basics": [
      {
        question: "Which keyword is used to create a class in Java?",
        options: ["function", "class", "struct", "define"],
        answer: "class"
      },
      {
        question: "Which method is the starting point of a Java program?",
        options: ["start()", "run()", "main()", "execute()"],
        answer: "main()"
      },
      {
        question: "Which data type is used to store whole numbers?",
        options: ["float", "char", "int", "boolean"],
        answer: "int"
      },
      {
        question: "Which symbol is used to end a statement in Java?",
        options: [".", ",", ":", ";"],
        answer: ";"
      },
      {
        question: "Which keyword is used to create an object?",
        options: ["new", "object", "create", "instance"],
        answer: "new"
      }
    ],

    OOP: [
      {
        question: "Which concept allows a class to acquire properties of another class?",
        options: [
          "Encapsulation",
          "Inheritance",
          "Polymorphism",
          "Abstraction"
        ],
        answer: "Inheritance"
      },
      {
        question: "Which concept means hiding implementation details?",
        options: [
          "Inheritance",
          "Polymorphism",
          "Abstraction",
          "Compilation"
        ],
        answer: "Abstraction"
      },
      {
        question: "Which concept means one interface with multiple implementations?",
        options: [
          "Encapsulation",
          "Inheritance",
          "Polymorphism",
          "Object"
        ],
        answer: "Polymorphism"
      },
      {
        question: "Which access modifier provides the highest restriction?",
        options: ["public", "protected", "private", "default"],
        answer: "private"
      },
      {
        question: "Wrapping data and methods together is called?",
        options: [
          "Inheritance",
          "Encapsulation",
          "Abstraction",
          "Polymorphism"
        ],
        answer: "Encapsulation"
      }
    ]
  },

  "Data Structures": {
    Arrays: [
      {
        question: "Which data structure stores elements in contiguous memory?",
        options: ["Linked List", "Array", "Tree", "Graph"],
        answer: "Array"
      },
      {
        question: "What is the index of the first element in a Java array?",
        options: ["0", "1", "-1", "2"],
        answer: "0"
      },
      {
        question: "Which property gives the number of elements in a Java array?",
        options: ["size()", "length", "count()", "capacity"],
        answer: "length"
      },
      {
        question: "Which data structure follows LIFO?",
        options: ["Queue", "Stack", "Array", "Graph"],
        answer: "Stack"
      },
      {
        question: "Which data structure follows FIFO?",
        options: ["Stack", "Tree", "Queue", "Graph"],
        answer: "Queue"
      }
    ],

    "Linked Lists": [
      {
        question: "A linked list consists of nodes and what?",
        options: ["Indexes", "Pointers/References", "Arrays", "Functions"],
        answer: "Pointers/References"
      },
      {
        question: "Which linked list has links in both directions?",
        options: [
          "Singly Linked List",
          "Doubly Linked List",
          "Circular List",
          "Linear List"
        ],
        answer: "Doubly Linked List"
      },
      {
        question: "What does the last node of a normal linked list point to?",
        options: ["First node", "Middle node", "Null", "Previous node"],
        answer: "Null"
      },
      {
        question: "Which operation is generally efficient at the beginning of a linked list?",
        options: ["Insertion", "Searching", "Sorting", "Random access"],
        answer: "Insertion"
      },
      {
        question: "Which structure allows sequential access to elements?",
        options: ["Linked List", "Hash Table", "Heap", "Binary Search Tree"],
        answer: "Linked List"
      }
    ]
  },

  DBMS: {
    SQL: [
      {
        question: "Which SQL command is used to retrieve data?",
        options: ["GET", "SELECT", "FETCH", "READ"],
        answer: "SELECT"
      },
      {
        question: "Which command is used to add a new row?",
        options: ["ADD", "INSERT", "CREATE", "UPDATE"],
        answer: "INSERT"
      },
      {
        question: "Which command modifies existing records?",
        options: ["CHANGE", "MODIFY", "UPDATE", "ALTER"],
        answer: "UPDATE"
      },
      {
        question: "Which command removes records from a table?",
        options: ["REMOVE", "DELETE", "DROP", "CLEAR"],
        answer: "DELETE"
      },
      {
        question: "Which clause is used to filter records?",
        options: ["WHERE", "FILTER", "HAVING", "SEARCH"],
        answer: "WHERE"
      }
    ]
  }
};

function Practice() {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("adaptive");

  const subjects = Object.keys(questionBank);

  const topics = subject
    ? Object.keys(questionBank[subject])
    : [];

  const startQuiz = () => {
    if (!subject || !topic) {
      alert("Please select a subject and topic.");
      return;
    }

    let selectedQuestions = questionBank[subject][topic];

    // Adjust question count based on mode
    if (mode === "quick") {
      selectedQuestions = selectedQuestions.slice(0, 3);
    } else if (mode === "revision") {
      selectedQuestions = selectedQuestions.slice(0, 4);
    }
    // adaptive keeps all 5

    setQuestions(selectedQuestions);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setAnswers([]);
    setResult(null);
    setQuizStarted(true);
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      alert("Please select an answer.");
      return;
    }

    const updatedAnswers = [
      ...answers,
      selectedAnswer
    ];

    setAnswers(updatedAnswers);
    setSelectedAnswer("");

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(updatedAnswers);
    }
  };

  const calculateResult = (finalAnswers) => {
    let correct = 0;

    questions.forEach((question, index) => {
      if (finalAnswers[index] === question.answer) {
        correct++;
      }
    });

    const score = Math.round(
      (correct / questions.length) * 100
    );

    savePerformance(score);

    setResult({
      score,
      correct,
      total: questions.length
    });
  };

  const savePerformance = (score) => {
    const savedStudent =
      localStorage.getItem("student");

    if (!savedStudent) {
      alert("Student data not found. Please login again.");
      navigate("/login");
      return;
    }

    const student = JSON.parse(savedStudent);

    if (!student.topics) {
      student.topics = {};
    }

    student.topics[topic] = {
      score: score,
      completed: true,
      subject: subject,
      lastAttempt: new Date().toISOString()
    };

    if (!student.quizHistory) {
      student.quizHistory = [];
    }

    student.quizHistory.push({
      subject,
      topic,
      score,
      date: new Date().toISOString()
    });

    const completedTopics = Object.values(
      student.topics
    ).filter(
      (data) => data.completed === true
    ).length;

    student.learningStreak =
      completedTopics > 0
        ? Math.min(completedTopics, 7)
        : 0;

    localStorage.setItem(
      "student",
      JSON.stringify(student)
    );
  };

  const restartQuiz = () => {
    setQuizStarted(false);
    setResult(null);
    setSubject("");
    setTopic("");
    setQuestions([]);
    setAnswers([]);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    // Mode stays the same so user can take another quiz in same mode
  };

  const progressPercent =
    quizStarted && !result && questions.length > 0
      ? ((currentQuestion + 1) / questions.length) * 100
      : 0;

  return (
    <div>
      <Sidebar />

      <main className="practice-page">
        {!quizStarted && !result && (
          <>
            <div className="practice-header">
              <h1>Practice & Assessment 📝</h1>
              <p>
                Test your knowledge and let LearnAI identify your strengths and weaknesses.
              </p>

              <div className="practice-badges">
                <span>AI-powered drills</span>
                <span>Smart progress</span>
                <span>Quick revision</span>
              </div>
            </div>

            <div className="practice-quick-stats">
              <div className="quick-stat">
                <span>Target</span>
                <strong>Weak areas</strong>
              </div>

              <div className="quick-stat">
                <span>Mode</span>
                <strong>Adaptive</strong>
              </div>

              <div className="quick-stat">
                <span>Focus</span>
                <strong>Concept mastery</strong>
              </div>
            </div>

            <div className="practice-card">
              <h2>Start Your Assessment</h2>
              <p>Select a subject and topic to begin your learning challenge.</p>

              <div className="mode-selector">
                <button 
                  type="button" 
                  className={`mode-card ${mode === "adaptive" ? "selected" : ""}`}
                  onClick={() => setMode("adaptive")}
                >
                  <span>Adaptive</span>
                  <small>Build confidence with focused practice</small>
                </button>
                <button 
                  type="button" 
                  className={`mode-card ${mode === "quick" ? "selected" : ""}`}
                  onClick={() => setMode("quick")}
                >
                  <span>Quick Quiz</span>
                  <small>Fast skills check</small>
                </button>
                <button 
                  type="button" 
                  className={`mode-card ${mode === "revision" ? "selected" : ""}`}
                  onClick={() => setMode("revision")}
                >
                  <span>Revision</span>
                  <small>Repeat and retain</small>
                </button>
              </div>

              <label>Subject</label>
              <select
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                  setTopic("");
                }}
              >
                <option value="">Select Subject</option>
                {subjects.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>

              <label>Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={!subject}
              >
                <option value="">Select Topic</option>
                {topics.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>

              <button onClick={startQuiz} className="start-btn">
                Start Assessment
              </button>
            </div>
          </>
        )}

        {quizStarted && !result && (
          <div className="quiz-container">
            <div className="quiz-header">
              <div>
                <h1>{topic}</h1>
                <p>{subject}</p>
              </div>

              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
            </div>

            <div className="quiz-progress">
              <div
                style={{
                  width: `${progressPercent}%`
                }}
              />
            </div>

            <div className="quiz-card">
              <div className="quiz-topline">
                <span className={`mode-badge ${mode}`}>
                  {mode === "adaptive" ? "Adaptive" : mode === "quick" ? "Quick Quiz" : "Revision"}
                </span>
                <span>{questions[currentQuestion].options.length} Options</span>
              </div>

              <h2>{questions[currentQuestion].question}</h2>

              <div className="options">
                {questions[currentQuestion].options.map((option) => (
                  <button
                    key={option}
                    className={selectedAnswer === option ? "option selected" : "option"}
                    onClick={() => setSelectedAnswer(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="quiz-actions">
                <button
                  type="button"
                  className="hint-btn"
                  onClick={() =>
                    alert("Review the concept and eliminate the clearly wrong options before choosing the best answer.")
                  }
                >
                  Need a Hint?
                </button>

                <button className="next-btn" onClick={handleNext}>
                  {currentQuestion === questions.length - 1
                    ? "Submit Assessment"
                    : "Next Question →"}
                </button>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="result-container">
            <div className="result-card">
              <div className="result-icon">
                {result.score >= 80 ? "🎉" : result.score >= 60 ? "👍" : "🔁"}
              </div>

              <h1>Assessment Complete!</h1>
              <p>
                {subject} → {topic}
              </p>

              <div className="score-wrap">
                <div className="score">{result.score}%</div>
              </div>

              <div className="result-summary-grid">
                <div className="summary-item">
                  <span>Correct</span>
                  <strong>{result.correct}</strong>
                </div>

                <div className="summary-item">
                  <span>Total</span>
                  <strong>{result.total}</strong>
                </div>

                <div className="summary-item">
                  <span>Mode</span>
                  <strong>{mode === "adaptive" ? "Adaptive" : mode === "quick" ? "Quick" : "Revision"}</strong>
                </div>
              </div>

              {result.score < 60 && (
                <div className="result-message weak">
                  🔴 This topic needs improvement. Review the basics and retake a short practice round.
                </div>
              )}

              {result.score >= 60 && result.score < 80 && (
                <div className="result-message medium">
                  🟡 Good progress! More practice will help you improve consistency and confidence.
                </div>
              )}

              {result.score >= 80 && (
                <div className="result-message strong">
                  🟢 Excellent! You are performing well in this topic. Try a slightly tougher challenge next.
                </div>
              )}

              <div className="result-buttons">
                <button onClick={() => navigate("/dashboard")}>View Dashboard</button>
                <button onClick={restartQuiz}>Take Another Assessment</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Practice;