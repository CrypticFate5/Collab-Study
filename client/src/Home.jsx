import React from "react";
import Navbar from "./Components/Navbar";

const Home = () => {
  return (
    <div className="bg-slate-900 min-h-screen">
      <Navbar />
      <div
        className="flex flex-col items-center justify-center h-[92vh] w-full bg-cover bg-center text-white"
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

export default Home;
