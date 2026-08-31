import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Performance from "./pages/Performance";
import Weakness from "./pages/Weakness";
import LearningPath from "./pages/LearningPath";
import Practice from "./pages/Practice";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import AIAssistant from "./pages/AIAssistant";
import Leaderboard from "./pages/Leaderboard";
import StudyPlanner from "./pages/StudyPlanner";
import Certificates from "./pages/Certificates";
import Statistics from "./pages/Statistics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/weakness" element={<Weakness />} />
        <Route path="/learning-path" element={<LearningPath />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/study-planner" element={<StudyPlanner />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/statistics" element={<Statistics />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;