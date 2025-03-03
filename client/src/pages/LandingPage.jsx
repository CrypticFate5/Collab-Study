import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  // Check if the user is authenticated when the component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:5000/verify-token", {
          withCredentials: true, // Ensure cookies are sent with requests
        });
        setIsAuthenticated(true); // User is authenticated
      } catch (error) {
        setIsAuthenticated(false); // User is not authenticated
      }
    };
    checkAuth();
  }, []);

  // Handle logout
  // In your Home component (or wherever you handle the logout)
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });
      setIsAuthenticated(false); // Clear the authentication state
      navigate("/login", { replace: true }); // Redirect to login page immediately
      window.location.reload(); // Force a page reload to clear any stale state
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading while checking authentication
  }

  return (
    <div className="bg-slate-900 min-h-screen">
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <div
        className="flex flex-col items-center justify-center h-[100vh] w-full bg-cover bg-center text-white"
        style={{
          backgroundImage: `url('/banner.jpg')`,
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* CollabStudy Title with One-Time Bounce Animation */}
        <h1
          className="text-[150px] font-bold mb-2 opacity-90"
          style={{
            animation: "bounce 2s ease-in-out forwards",
          }}
        >
          CollabStudy
        </h1>

        {/* Caption with Fade-In and Slide-Up Animation */}
        <p
          className="text-xl text-center max-w-xl opacity-0"
          style={{
            animation: "fadeInSlideUp 1s forwards",
            animationDelay: "2s",
          }}
        >
          Empowering students to reach new heights through collaborative study
          sessions, real-time communication, and personalized learning tools
          designed to elevate your academic journey.
        </p>
      </div>

      {/* Custom CSS for Animations */}
      <style>
        {`
          @keyframes fadeInSlideUp {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce {
            0% {
              opacity: 0;
              transform: translateY(0);
            }
            20% {
              opacity: 1;
              transform: translateY(-30px);
            }
            50% {
              transform: translateY(15px);
            }
            100% {
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default LandingPage;
