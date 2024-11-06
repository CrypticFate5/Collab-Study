import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "./Components/Toast.jsx"; // Import the Toast component

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    usernameMsg: "",
    emailMsg: "",
    passwordMsg: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false); // State for toast visibility
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessages({ usernameMsg: "", emailMsg: "", passwordMsg: "" });

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowToast(true); // Show the toast on success
      } else {
        // Set validation error messages
        setErrorMessages(data.error);
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  const handleBacktoHome = () => {
    navigate("/");
  };

  // Redirect to login page after toast disappears
  const handleToastClose = () => {
    setShowToast(false);
    navigate("/login");
  };

  return (
    <main className="bg-black h-screen w-full flex flex-col overflow-hidden">
      <p
        className="text-l text-gray-200 m-4 hover:text-[#ff00cc] cursor-pointer w-32 fixed top-3 left-2"
        onClick={handleBacktoHome}
      >
        &larr; Back to home
      </p>
      <div className="flex h-full justify-center items-center">
        <div
          className="bg-black bg-opacity-55 p-10 rounded-xl flex flex-col gap-5 max-w-md w-full mx-4"
          style={{
            filter: "drop-shadow(0 0 70px rgb(186, 36, 223))",
          }}
        >
          <h3 className="text-3xl text-slate-100 font-medium text-center p-5 max-md:text-2xl max-md:p-2">
            Signup
          </h3>
          <form
            className="flex flex-col gap-4 text-sm max-md:text-xs"
            onSubmit={handleSignup}
          >
            <label className="text-slate-100">
              Username
              <input
                type="text"
                className="mt-1 p-2 border border-slate-400 bg-black opacity-55 rounded-md w-full"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            {errorMessages.usernameMsg && (
              <p className="text-red-500">{errorMessages.usernameMsg}</p>
            )}
            <label className="text-slate-100">
              Email
              <input
                type="text"
                className="mt-1 p-2 border border-slate-400 bg-black opacity-55 rounded-md w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            {errorMessages.emailMsg && (
              <p className="text-red-500">{errorMessages.emailMsg}</p>
            )}
            <label className="text-slate-100 relative">
              Password
              <input
                type={showPassword ? "text" : "password"}
                className="mt-1 p-2 border border-gray-400 bg-black opacity-55 rounded-md w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute right-3 top-9 cursor-pointer max-md:top-7"
                onClick={togglePassword}
              >
                <img
                  src={showPassword ? "/visible.svg" : "/invisible.svg"}
                  alt="Toggle visibility"
                  width={20}
                  height={20}
                />
              </span>
            </label>
            {errorMessages.passwordMsg && (
              <p className="text-red-500">{errorMessages.passwordMsg}</p>
            )}
            <button
              type="submit"
              className="mt-4 mb-2 mx-auto w-1/2 justify-center items-center text-white p-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Submit
            </button>
          </form>
          <p className="text-slate-300 text-center text-sm">
            Already have an account?&nbsp;
            <a href="/login" className="text-[#ff00cc]">
              Login
            </a>
          </p>
        </div>
      </div>

      {/* Display toast on successful signup */}
      {showToast && (
        <Toast
          message="Signup successful! Redirecting to login page..."
          onClose={handleToastClose}
        />
      )}
    </main>
  );
};

export default SignupPage;
