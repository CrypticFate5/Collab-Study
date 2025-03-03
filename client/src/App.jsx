import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Navbar from "./Components/Navbar.jsx"; // Import Navbar
import SignupPage from "./pages/Signup.jsx";
import LoginPage from "./pages/Login.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Home from "./pages/Home.jsx";
import ChatPDF from "./pages/ChatPDF.jsx";
import PrivateRoute from "./Components/PrivateRoute.jsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost:5000/verify-token", { withCredentials: true });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={isAuthenticated ? <Home /> : <SignupPage />} />
        <Route path="/login" element={isAuthenticated ? <Home /> : <LoginPage />} />

        <Route
          path="/home"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/chatpdf"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <ChatPDF />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
