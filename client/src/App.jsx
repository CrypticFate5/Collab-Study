import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./Signup.jsx";
import LoginPage from "./Login.jsx";
import Home from "./Home.jsx"; // Rename App to Home to avoid naming conflicts
import "./index.css";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
