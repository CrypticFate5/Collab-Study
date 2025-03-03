import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/logout", {}, { withCredentials: true });

      setIsAuthenticated(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="w-full h-[8vh] flex items-center justify-between px-4 opacity-90 fixed top-0">
      <h1 className="text-xl font-semibold cursor-pointer">CollabStudy</h1>
      <div className="flex space-x-4">
        {isAuthenticated ? (
          <button className="bg-red-500 text-white px-4 py-1 rounded-2xl" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <button className="border-2 border-gray-200 text-gray-200 px-4 py-1 rounded-2xl" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
            <button className="bg-gray-200 text-black px-5 py-1 rounded-2xl" onClick={() => navigate("/login")}>
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
