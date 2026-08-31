import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "../styles/aiassistant.css";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function AIAssistant() {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [input, setInput] = useState("Give me a smart study plan for today.");
  const [messages, setMessages] = useState([]);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("learnai_api_key") || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedStudent = localStorage.getItem("student");

    if (!savedStudent) {
      navigate("/login");
      return;
    }

    try {
      const parsed = JSON.parse(savedStudent);
      setStudent(parsed);

      const savedMessages = localStorage.getItem("learnai_chat_history");
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages([
          {
            sender: "ai",
            text: `Hi ${parsed.fullName || parsed.name || "there"}! I’m LearnAI, your adaptive learning coach. I can diagnose weak areas, build a study plan, and help you improve faster.`
          }
        ]);
      }
    } catch (error) {
      console.error("AI assistant error:", error);
      localStorage.removeItem("student");
      localStorage.removeItem("loggedIn");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (student && messages.length > 0) {
      localStorage.setItem("learnai_chat_history", JSON.stringify(messages));
    }
  }, [messages, student]);

  const topicList = useMemo(() => Object.entries(student?.topics || {}), [student]);

  const weakTopics = useMemo(
    () => [...topicList].filter(([, data]) => Number(data.score || 0) < 60).sort((a, b) => Number(a[1].score || 0) - Number(b[1].score || 0)),
    [topicList]
  );

  const strongTopics = useMemo(
    () => [...topicList].filter(([, data]) => Number(data.score || 0) >= 80).sort((a, b) => Number(b[1].score || 0) - Number(a[1].score || 0)),
    [topicList]
  );

  const averageScore = useMemo(
    () =>
      topicList.length > 0
        ? Math.round(
            topicList.reduce((sum, [, data]) => sum + Number(data.score || 0), 0) /
              topicList.length
          )
        : 0,
    [topicList]
  );

  const quickPrompts = [
    "Give me a smart study plan for today.",
    "Which topic should I focus on first?",
    "What are my weak areas?",
    "How can I improve my score fast?",
    "What is my strongest topic?",
    "Create a 3-day learning schedule."
  ];

  const buildStudyPlan = () => {
    if (!topicList.length) {
      return [
        "Start with a quick baseline assessment.",
        "Review your most recent study notes.",
        "Take one short quiz and analyze your mistakes."
      ];
    }

    const focusTopic = weakTopics[0]?.[0] || strongTopics[0]?.[0] || "general revision";
    const strongestTopic = strongTopics[0]?.[0] || "your strong foundation";

    return [
      `Spend 20 minutes revising ${focusTopic}.`,
      `Solve 10 practice questions on ${focusTopic} and review mistakes carefully.`,
      `End the session by revisiting ${strongestTopic} to build confidence and retain momentum.`
    ];
  };

  const studyPlan = useMemo(() => buildStudyPlan(), [weakTopics, strongTopics, topicList]);

  const buildReply = (question) => {
    const normalized = question.toLowerCase();
    const studentName = student?.fullName || student?.name || "Student";

    if (!normalized.trim()) {
      return "Please ask a question so I can guide your study plan.";
    }

    const targetTopic = topicList.find(([topic]) =>
      normalized.includes(topic.toLowerCase())
    );

    if (normalized.includes("plan") || normalized.includes("schedule") || normalized.includes("today") || normalized.includes("daily")) {
      const [step1, step2, step3] = studyPlan;
      return `Here is your adaptive study plan for today: 1) ${step1} 2) ${step2} 3) ${step3} Stay consistent and focus on quality practice, not just speed.`;
    }

    if (normalized.includes("weak") || normalized.includes("difficulty") || normalized.includes("focus") || normalized.includes("struggle")) {
      if (weakTopics.length > 0) {
        const firstWeak = weakTopics[0];
        return `Your biggest weak area is ${firstWeak[0]} with a score of ${firstWeak[1].score}%. The best move is to do a short concept review, complete 10 focused questions, and then retake a mini quiz to measure improvement.`;
      }

      return "Your performance is balanced right now. Keep practicing consistently and test yourself through timed revisions to stay sharp.";
    }

    if (normalized.includes("strong") || normalized.includes("best") || normalized.includes("good") || normalized.includes("confident")) {
      if (strongTopics.length > 0) {
        const bestTopic = strongTopics[0];
        return `Your strongest topic is ${bestTopic[0]} with a score of ${bestTopic[1].score}%. Use that as a confidence builder and challenge yourself with harder questions to deepen mastery.`;
      }

      return "You do not have a standout topic yet, so focus on consistency and short success wins before moving to harder material.";
    }

    if (targetTopic) {
      const [, data] = targetTopic;
      const score = Number(data.score || 0);
      const advice =
        score < 60
          ? "This topic needs a structured revision cycle and repetition-based practice."
          : score < 80
          ? "This topic is improving. Keep building accuracy and apply the concept in varied problems."
          : "This topic is strong. Push yourself with application and scenario-based problems.";

      return `${targetTopic[0]} is currently at ${score}%. ${advice}`;
    }

    if (normalized.includes("score") || normalized.includes("average") || normalized.includes("progress")) {
      return `Your current average score is ${averageScore}%. That is a strong baseline. Your next goal is to improve consistency and reduce mistakes in the lowest-scoring topics.`;
    }

    if (normalized.includes("motivate") || normalized.includes("encourage") || normalized.includes("confidence")) {
      return `You are making real progress, ${studentName}. Small daily improvements add up. Keep showing up, and the results will compound over time.`;
    }

    return `Based on your current results, I recommend focusing on ${weakTopics.length > 0 ? weakTopics[0][0] : "your strongest topic"} first. That gives you the highest efficiency gain and keeps your momentum strong.`;
  };

  const askRealAI = async (question) => {
    const trimmedKey = apiKey.trim();

    if (!trimmedKey) {
      return buildReply(question);
    }

    const payload = {
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are LearnAI, an adaptive learning coach for a student platform. Provide smart study guidance, praise effort, identify weak areas, and build concise action plans using the student's performance data."
        },
        {
          role: "user",
          content: `Student context: name=${student?.fullName || student?.name || "Student"}; average score=${averageScore}%; weak topics=${weakTopics.map(([topic]) => topic).join(", ") || "none"}; strong topics=${strongTopics.map(([topic]) => topic).join(", ") || "none"}; topic scores=${JSON.stringify(Object.fromEntries(topicList))}. User question: ${question}`
        }
      ],
      temperature: 0.8,
      max_tokens: 300
    };

    try {
      const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${trimmedKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "AI request failed.");
      }

      return (
        data?.choices?.[0]?.message?.content?.trim() ||
        buildReply(question)
      );
    } catch (error) {
      console.error("OpenRouter error:", error);
      return buildReply(question);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!input.trim()) {
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: input },
        { sender: "ai", text: "Please ask a question so I can guide your study plan." }
      ]);
      return;
    }

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    const aiReply = await askRealAI(userMessage);

    setMessages((prev) => [...prev, { sender: "ai", text: aiReply }]);
    setLoading(false);
  };

  if (!student) {
    return (
      <div className="dashboard">
        <h2>Loading your adaptive AI coach...</h2>
      </div>
    );
  }

  return (
    <>
      <Sidebar />

      <main className="dashboard ai-assistant-page">
        <div className="ai-header">
          <div>
            <span className="page-tag">AI LEARNING COACH</span>
            <h1>🤖 LearnAI Assistant</h1>
            <p>Adaptive guidance based on your latest learning performance.</p>
          </div>

          <div className="ai-status-pill">
            <span className="status-dot" />
            {apiKey ? "AI Live" : "Local AI"}
          </div>
        </div>

        <div className="ai-summary-grid">
          <div className="ai-summary-card">
            <span>🎯</span>
            <div>
              <strong>{weakTopics.length}</strong>
              <p>Weak Topics</p>
            </div>
          </div>

          <div className="ai-summary-card">
            <span>📈</span>
            <div>
              <strong>{averageScore}%</strong>
              <p>Average Score</p>
            </div>
          </div>

          <div className="ai-summary-card">
            <span>✅</span>
            <div>
              <strong>{strongTopics.length}</strong>
              <p>Strong Topics</p>
            </div>
          </div>
        </div>

        <section className="ai-panel">
          <div className="panel-title">
            <div>
              <span className="page-tag">AI INSIGHTS</span>
              <h2>Adaptive coaching for {student.fullName || student.name || "Student"}</h2>
            </div>
          </div>

          <div className="ai-insight-grid">
            <div className="ai-insight-card primary-card">
              <h3>Focus area</h3>
              <p>{weakTopics.length > 0 ? weakTopics[0][0] : strongTopics[0]?.[0] || "General revision"}</p>
            </div>

            <div className="ai-insight-card">
              <h3>Trend</h3>
              <p>{averageScore >= 75 ? "Strong upward momentum" : averageScore >= 60 ? "Improving steadily" : "Needs a focused reset"}</p>
            </div>

            <div className="ai-insight-card">
              <h3>Best next move</h3>
              <p>{weakTopics.length > 0 ? "Target the lowest score first" : "Challenge yourself with advanced practice"}</p>
            </div>
          </div>

          <div className="api-key-box">
            <label htmlFor="learnai-api-key">OpenRouter API key (optional)</label>
            <input
              id="learnai-api-key"
              type="password"
              value={apiKey}
              onChange={(event) => {
                const value = event.target.value;
                setApiKey(value);
                localStorage.setItem("learnai_api_key", value);
              }}
              placeholder="Paste your OpenRouter key here"
            />
            <small>Leave it blank to keep using the built-in smart coaching logic.</small>
          </div>

          <div className="ai-chat-box">
            {messages.map((message, index) => (
              <div
                key={`${message.sender}-${index}`}
                className={`ai-message ${message.sender === "user" ? "user" : "ai"}`}
              >
                {message.text}
              </div>
            ))}
            {loading && <div className="ai-message ai">Thinking...</div>}
          </div>

          <div className="ai-quick-actions">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="quick-prompt"
                onClick={() => setInput(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          <form className="ai-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask your learning coach..."
            />
            <button type="submit" disabled={loading}>{loading ? "Sending..." : "Send"}</button>
          </form>
        </section>

        <section className="ai-panel">
          <div className="panel-title">
            <div>
              <span className="page-tag">STUDY PLAN</span>
              <h2>Personalized plan</h2>
            </div>
          </div>

          <div className="plan-card-wrap">
            {studyPlan.map((step, index) => (
              <div key={step} className="plan-card">
                <span>0{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="ai-panel">
          <div className="panel-title">
            <div>
              <span className="page-tag">SMART SUGGESTIONS</span>
              <h2>Recommended next steps</h2>
            </div>
          </div>

          <ul className="ai-list">
            {weakTopics.length > 0 ? (
              <li>
                Focus on <strong>{weakTopics[0][0]}</strong> first because it has the lowest score.
              </li>
            ) : (
              <li>Great job! Continue practicing and challenge yourself with advanced questions.</li>
            )}

            <li>Use a 15-minute review block before every new practice session.</li>
            <li>Revisit your strongest topic to build confidence before harder exercises.</li>
            <li>Take a short quiz after each study block to track improvement.</li>
          </ul>
        </section>
      </main>
    </>
  );
}

export default AIAssistant;
