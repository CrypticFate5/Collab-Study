import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
    <Link
      to="/chatpdf"
      className="gradientColour p-4 rounded-3xl hover:gradientColour2"
    >
      Go to PDF Summarizer
    </Link>
  </div>
);

export default Home;
