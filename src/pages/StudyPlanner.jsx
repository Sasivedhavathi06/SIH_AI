import { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../styles/studyplanner.css";

function StudyPlanner() {
  const [schedule, setSchedule] = useState([
    { day: "Monday", topic: "Java Basics", time: "45 min", status: "completed" },
    { day: "Tuesday", topic: "OOP Concepts", time: "60 min", status: "completed" },
    { day: "Wednesday", topic: "Data Structures", time: "75 min", status: "in-progress" },
    { day: "Thursday", topic: "Arrays & Lists", time: "60 min", status: "pending" },
    { day: "Friday", topic: "SQL Basics", time: "50 min", status: "pending" },
    { day: "Saturday", topic: "Advanced Topics", time: "90 min", status: "pending" },
    { day: "Sunday", topic: "Revision & Practice", time: "120 min", status: "pending" }
  ]);

  const [newTopic, setNewTopic] = useState("");
  const [selectedDay, setSelectedDay] = useState("Monday");

  const addToSchedule = () => {
    if (newTopic.trim()) {
      const newScheduleItem = {
        day: selectedDay,
        topic: newTopic,
        time: "60 min",
        status: "pending"
      };
      setSchedule([...schedule, newScheduleItem]);
      setNewTopic("");
    }
  };

  const updateStatus = (index, status) => {
    const updatedSchedule = [...schedule];
    updatedSchedule[index].status = status;
    setSchedule(updatedSchedule);
  };

  const completedCount = schedule.filter((s) => s.status === "completed").length;
  const inProgressCount = schedule.filter((s) => s.status === "in-progress").length;
  const pendingCount = schedule.filter((s) => s.status === "pending").length;

  const weeklyHours = schedule.reduce((sum, s) => {
    const mins = parseInt(s.time);
    return sum + (mins / 60);
  }, 0);

  return (
    <>
      <Sidebar />

      <main className="study-planner-page">
        <div className="planner-header">
          <h1>📅 Study Planner</h1>
          <p>Plan your weekly learning schedule and track progress</p>
        </div>

        <div className="planner-container">
          {/* Weekly Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <span>✅</span>
              <div>
                <strong>{completedCount}</strong>
                <p>Completed</p>
              </div>
            </div>

            <div className="stat-card">
              <span>⏳</span>
              <div>
                <strong>{inProgressCount}</strong>
                <p>In Progress</p>
              </div>
            </div>

            <div className="stat-card">
              <span>📋</span>
              <div>
                <strong>{pendingCount}</strong>
                <p>Pending</p>
              </div>
            </div>

            <div className="stat-card">
              <span>⏱️</span>
              <div>
                <strong>{weeklyHours.toFixed(1)}h</strong>
                <p>Weekly Hours</p>
              </div>
            </div>
          </div>

          {/* Add New Task */}
          <div className="add-task-section">
            <h2>📝 Add New Topic</h2>
            <div className="add-task-form">
              <input
                type="text"
                placeholder="Enter topic to learn..."
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                className="topic-input"
              />

              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="day-select"
              >
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ].map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <button onClick={addToSchedule} className="add-btn">
                Add to Schedule
              </button>
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="weekly-schedule">
            <h2>📚 Weekly Schedule</h2>

            <div className="schedule-items">
              {schedule.map((item, index) => (
                <div key={index} className={`schedule-item ${item.status}`}>
                  <div className="schedule-day-info">
                    <div className="day-label">{item.day}</div>
                    <div className="day-topic">{item.topic}</div>
                    <div className="day-time">⏱️ {item.time}</div>
                  </div>

                  <div className="schedule-status">
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(index, e.target.value)}
                      className={`status-select ${item.status}`}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="in-progress">⌛ In Progress</option>
                      <option value="completed">✅ Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study Tips */}
          <div className="study-tips">
            <h2>💡 Study Tips</h2>

            <div className="tips-grid">
              <div className="tip-card">
                <span>🎯</span>
                <strong>Set Goals</strong>
                <p>Aim for 10-15 hours of learning per week</p>
              </div>

              <div className="tip-card">
                <span>⏰</span>
                <strong>Time Management</strong>
                <p>Break topics into 45-60 minute sessions</p>
              </div>

              <div className="tip-card">
                <span>🔄</span>
                <strong>Consistency</strong>
                <p>Study every day to build a strong streak</p>
              </div>

              <div className="tip-card">
                <span>🧠</span>
                <strong>Active Learning</strong>
                <p>Practice quizzes after each topic</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default StudyPlanner;
