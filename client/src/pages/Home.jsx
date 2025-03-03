import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
    <div className="flex flex-col space-y-4 items-center">
      <Link
        to="/chatpdf"
        className="px-6 py-3 rounded-xl bg-gradient-to-r text-gray-200 from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
      >
        Go to PDF Summarizer
      </Link>
      
      <Link
        to="/video-call"
        className="px-6 py-3 rounded-xl bg-gradient-to-r text-gray-200 from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600"
      >
        Start Video Call
      </Link>
    </div>
  </div>
);

export default Home;