import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    usernameMsg: "",
    passwordMsg: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate form submission and navigate on success.
    // Replace with API call if backend is ready.
    console.log("Login successful");
    setErrorMessages({ usernameMsg: "", passwordMsg: "" });
    navigate("/home");
  };

  return (
    <main className="bg-black h-screen w-full flex flex-col overflow-hidden">
      <div className="flex h-full justify-center items-center">
        <div
          className="bg-black bg-opacity-60 p-10 rounded-xl flex flex-col gap-5 max-w-md w-full mx-4"
          style={{
            filter: "drop-shadow(0 0 70px rgb(101, 47, 231) )",
          }}
        >
          <h3 className="text-3xl text-slate-100 font-medium text-center p-5 max-md:text-2xl max-md:p-2">
            Login
          </h3>
          <form
            className="flex flex-col gap-4 text-sm max-md:text-xs"
            onSubmit={handleLogin}
          >
            <label className="text-slate-100">
              Username/Email
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
            Don’t have an account?&nbsp;
            <Link to="/signup" className="text-[#ff00cc]">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
