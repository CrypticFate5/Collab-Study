import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/Signup.jsx";
import LoginPage from "./pages/Login.jsx";
import LandingPage from "./pages/LandingPage.jsx"; // Rename App to Home to avoid naming conflicts
import "./index.css";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
