import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
    <Link
      to="/chatpdf"
      className="p-4 rounded-3xl bg-gradient-to-r text-gray-200 from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
    >
      Go to PDF Summarizer
    </Link>
  </div>
);

export default Home;
