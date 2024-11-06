import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const PdfUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false); // Popup visibility state

  const chatEndRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file.type === "application/pdf") {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert("Please upload a PDF file.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: "application/pdf",
  });

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a PDF file.");

    const formData = new FormData();
    formData.append("pdf", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/summarize-pdf",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setChatMessages([
        ...chatMessages,
        { role: "system", text: response.data.summary },
      ]);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleSendQuery = async () => {
    if (!selectedFile) {
      setShowPopup(true); // Show popup if no PDF is uploaded
      setTimeout(() => setShowPopup(false), 3000); // Hide after 3 seconds
      return;
    }

    if (!userQuery.trim()) return;

    setChatMessages([...chatMessages, { role: "user", text: userQuery }]);
    setUserQuery("");

    try {
      const response = await axios.post("http://localhost:5000/api/ask-query", {
        query: userQuery,
      });
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: response.data.answer },
      ]);
    } catch (error) {
      console.error("Query failed:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendQuery();
    }
  };

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="flex h-screen">
      {/* PDF Upload Section */}
      <div className="w-1/3 p-6 backgroundGradient2 flex flex-col gap-3 items-center">
        <h2 className="text-2xl text-gray-200 text-center font-semibold mt-2">
          ChatPDF Summarizer
        </h2>
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-400 p-4 rounded-lg text-center cursor-pointer flex items-center justify-center h-48 mt-40 relative"
        >
          <input {...getInputProps()} />
          {previewUrl ? (
            <embed
              src={previewUrl}
              type="application/pdf"
              className="w-full h-full object-cover"
            />
          ) : (
            <p>Drag and drop a PDF file here, or click to select</p>
          )}
        </div>
        <button
          className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-2 rounded-xl text-white"
          onClick={handleUpload}
        >
          Summarize PDF
        </button>
        <p className="text-gray-400 text-sm mt-2 text-center">
          Tips: Upload a PDF, then use the chat to ask questions related to the
          document.
        </p>
      </div>

      {/* Chat Section */}
      <div
        className="w-2/3 p-6  text-white flex flex-col justify-between"
        style={{
          backgroundImage: `url('/Chatbg.jpg')`,
          backgroundRepeat: "no-repeat",
          objectFit: "cover",
        }}
      >
        <div className="overflow-y-auto h-4/5 p-4 border rounded bg-black relative">
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <p
                className={`${
                  message.role === "user"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500"
                    : "bg-blue-600"
                } inline-block p-2 rounded-lg`}
              >
                {message.text}
              </p>
            </div>
          ))}
          <div ref={chatEndRef} /> {/* Invisible div to mark the end of chat */}
          {/* Popup message when PDF is not uploaded */}
          {showPopup && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-300 text-red-900 p-5 rounded-lg shadow-lg text-center">
              Please upload a PDF first to start chatting.
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2 mb-6 items-center">
          <input
            type="text"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask a question about the PDF..."
            className="flex-1  p-2 border rounded-lg bg-gray"
          />
          <button
            className="bg-gradient-to-b from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 px-4 py-2 rounded-r-3xl rounded-l-lg"
            onClick={handleSendQuery}
          >
            &#x27A4;
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfUpload;
