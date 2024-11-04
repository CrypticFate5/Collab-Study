import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigate = useNavigate();

  // Handler for Sign Up button
  const handleSignup = () => {
    navigate("/signup");
  };

  // Handler for Login button
  const handleLogin = () => {
    navigate("/login");
  };

  // Toggle Sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <>
      <div className="w-full bg-slate-900 h-[8vh] flex items-center justify-between px-4 opacity-90">
        {/* Hamburger Icon on the left */}
        <div
          className="bg-slate-900  flex justify-center items-center gap-5"
          onClick={toggleSidebar}
        >
          <img
            src="/hamburger.svg"
            alt="Menu"
            className="h-6 w-6 cursor-pointer  hover:bg-slate-800"
          />
          <h1 className="text-xl">CollabStudy</h1>
        </div>

        {/* Buttons on the right */}
        <div className="flex space-x-4">
          <button
            className="bordergradientColour text-purple-500 px-4 py-1 rounded transition duration-400 hover:gradientColour hover:text-white"
            onClick={handleSignup}
          >
            Sign Up
          </button>
          <button
            className="gradientColour text-white px-5 py-1 rounded transition duration-10000 hover:gradientColour2 hover:text-gray-200"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>

      {/* Sidebar with Transition */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-slate-800 p-4 shadow-lg transform transition-transform duration-300 ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className=" mb-3" onClick={toggleSidebar}>
          <img
            src="/hamburger.svg"
            alt="Menu"
            className="h-6 w-6 cursor-pointer"
          />
        </div>
        <ul className="text-white space-y-2">
          <li>
            <a href="/" className="hover:text-gray-400">
              Home
            </a>
          </li>
          <li>
            <a href="/about" className="hover:text-gray-400">
              About
            </a>
          </li>
          <li>
            <a href="/contact" className="hover:text-gray-400">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
