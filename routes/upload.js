import express from "express";
import multer from "multer";
import fileQueue from "../services/queue.js";
const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    const job = await fileQueue.add("process-file", {
      filePath: file.path,
    });

    res.json({
      jobId: job.id,
      status: "pending",
    });
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
