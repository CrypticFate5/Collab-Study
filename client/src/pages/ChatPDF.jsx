import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const PdfUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [uploadedPdfs, setUploadedPdfs] = useState([]); // Store list of uploaded PDFs
  const [currentSourceId, setCurrentSourceId] = useState(null); // Store sourceId for chat queries
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

  // Fetch uploaded PDFs on component mount
  useEffect(() => {
    const fetchUploadedPdfs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/pdf/list");
        setUploadedPdfs(response.data.pdfs);
      } catch (error) {
        console.error("Failed to fetch PDFs:", error);
      }
    };
    fetchUploadedPdfs();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a PDF file.");

    const formData = new FormData();
    formData.append("userId", 1);
    formData.append("pdfFile", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/pdf/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const uploadedPdf = response.data.pdf;
      const sourceId = response.data.sourceId;
      setUploadedPdfs([...uploadedPdfs, uploadedPdf]); // Add to list
      setCurrentSourceId(sourceId); // Store the sourceId for chat
      setSelectedFile(uploadedPdf); // Update selected file to the uploaded PDF
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handlePdfClick = async (pdf) => {
    setSelectedFile(pdf); // Store the selected PDF metadata
    setCurrentSourceId(pdf.sourceId); // Set the sourceId for chat queries

    try {
      const { data } = await axios.get(`http://localhost:5000/pdf/view/${pdf.s3Id}`);
      setPreviewUrl(data.url); // Set PDF preview URL
      setChatMessages([{ role: "system", text: "Chat started with PDF" }]);
    } catch (error) {
      console.error("Failed to load PDF:", error);
    }
  };

  const handleSendQuery = async () => {
    if (!currentSourceId) {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return;
    }

    if (!userQuery.trim()) return;

    setChatMessages([...chatMessages, { role: "user", text: userQuery }]);
    setUserQuery("");

    try {
      const response = await axios.post("http://localhost:5000/pdf/chat", {
        sourceId: currentSourceId, // Use the current sourceId for the selected PDF
        messages: [{ role: "user", content: userQuery }],
      });
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: response.data.content },
      ]);
    } catch (error) {
      console.error("Query failed:", error);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="flex h-screen">
      <div className="w-1/3 p-6 backgroundGradient2 flex flex-col gap-3 items-center">
        <h2 className="text-2xl text-gray-200 text-center font-semibold mt-2">
          ChatPDF Summarizer
        </h2>
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-400 p-4 rounded-lg text-center cursor-pointer flex items-center justify-center h-[27rem] mt-8 relative"
        >
          <input {...getInputProps()} />
          {previewUrl ? (
            <embed
              src={previewUrl}
              type="application/pdf"
              className="w-full h-full object-contain"
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

        {/* PDF List */}
        <div className="pdf-list mt-4">
          <h3 className="text-lg text-gray-200">Uploaded PDFs</h3>
          {uploadedPdfs.map((pdf, index) => (
            <div key={index} onClick={() => handlePdfClick(pdf)} className="cursor-pointer text-white mt-2">
              {pdf.pdfName}
            </div>
          ))}
        </div>
      </div>

      <div
        className="w-2/3 p-6 text-white flex flex-col justify-between"
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
          <div ref={chatEndRef} />
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
            onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
            placeholder="Ask a question about the PDF..."
            className="flex-1 p-2 border rounded-lg bg-gray"
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
