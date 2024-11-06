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
      <div className="w-full h-[8vh] flex items-center justify-between px-4 opacity-90 fixed top-0">
        {/* Hamburger Icon on the left */}
        <div
          className=" flex justify-center items-center gap-5"
          onClick={toggleSidebar}
        >
          <img
            src="/hamburger.svg"
            alt="Menu"
            className="h-6 w-6 cursor-pointer  hover:Navbarshadow"
          />
          <h1 className="text-xl font-semibold cursor-pointer ml-2">
            CollabStudy
          </h1>
        </div>

        {/* Buttons on the right */}
        <div className="flex space-x-4">
          <button
            className="border-2 border-gray-200 text-gray-200 px-4 py-1 rounded-2xl transition duration-400 hover:bg-gray-200 hover:text-black "
            onClick={handleSignup}
          >
            Sign Up
          </button>
          <button
            className="bg-gray-200 text-black px-5 py-1 rounded-2xl transition duration-10000  hover:text-gray-200 border-2 border-gray-200 hover:bg-transparent"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>

      {/* Sidebar with Transition */}
      <div
        className={`fixed top-0 left-0 h-full w-60 bg-slate-800 flex flex-col gap-3 p-6 text-md shadow-lg transform transition-transform duration-300 ${
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
        <ul className="text-white space-y-2 flex flex-col gap-2">
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
