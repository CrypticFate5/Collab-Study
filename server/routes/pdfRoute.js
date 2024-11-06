import express from "express";
import axios from "axios";
import fs from "fs";
import FormData from "form-data"; // Import the form-data library
import { addPdf } from "../services/pdfService.js";
import { upload } from "../services/s3Service.js";
import multer from "multer";

const router = express.Router();
const uploadMiddleware = multer({ dest: "uploads/" });

// Upload PDF route
router.post("/upload", uploadMiddleware.single("pdfFile"), async (req, res) => {
  let { userId } = req.body;
  const pdfFile = req.file;
  const pdfName = pdfFile.originalname;
  console.log(userId, pdfName);
  if (!pdfFile) {
    return res.status(400).json({ message: "No PDF file uploaded" });
  }
  // Convert userId to integer
  userId = parseInt(userId, 10); // Ensure userId is an integer

  if (isNaN(userId)) {
    return res
      .status(400)
      .json({ message: "Invalid userId. It must be an integer." });
  }

  try {
    // Step 1: Upload to S3
    const s3Result = await upload(pdfFile);
    const s3Id = s3Result.Key; // Use `s3Result.Location` if you prefer the full URL

    // Step 2: Add to ChatPDF
    const formData = new FormData();
    formData.append("file", fs.createReadStream(pdfFile.path));

    // Axios config for headers
    const options = {
      headers: {
        "x-api-key": process.env.CHATPDF_API_KEY,
        ...formData.getHeaders(), // Now correctly using `form-data` headers
      },
    };

    const chatPdfResponse = await axios.post(
      "https://api.chatpdf.com/v1/sources/add-file",
      formData,
      options
    );
    const sourceId = chatPdfResponse.data.sourceId;
    console.log(sourceId);
    // Step 3: Store in DB
    const pdf = await addPdf(userId, s3Id, sourceId, pdfName);
    res.status(200).json({ pdf });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to upload PDF", error: error.message });
  }
});

// List PDFs route
router.get("/list", async (req, res) => {
  const userId = req.user.id;
  const pdfs = await getPdfsByUser(userId);
  res.status(200).json({ pdfs });
});

// View PDF route
router.get("/view/:s3Id", (req, res) => {
  const s3Id = req.params.s3Id;
  const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Id}`;
  res.redirect(s3Url);
});

// Chat with PDF route
router.post("/chat", async (req, res) => {
  const { sourceId, messages } = req.body;
    const data = { sourceId:sourceId, messages:messages };
    console.log(data);
  try {
    const chatResponse = await axios.post(
      "https://api.chatpdf.com/v1/chats/message",
      data,
      {
        headers: { "x-api-key": process.env.CHATPDF_API_KEY ,
            "Content-Type": "application/json",
        },
      }
    );
    res.status(200).json({ content: chatResponse.data.content });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send chat message", error: error.message });
  }
});

export default router;
