import express from "express";
import multer from "multer";
import fileQueue from "../services/queue.js";
import pool from "../config/db.js";

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

    if (!file) {
      return res.status(400).json({ error: "File is required" });
    }

    // 1️⃣ Save file record
    const fileResult = await pool.query(
      "INSERT INTO files (file_path) VALUES ($1) RETURNING id",
      [file.path],
    );

    const fileId = fileResult.rows[0].id;

    // 2️⃣ Create job record
    const jobResult = await pool.query(
      "INSERT INTO jobs (file_id, status, progress) VALUES ($1, $2, $3) RETURNING id",
      [fileId, "pending", 0],
    );

    const jobId = jobResult.rows[0].id;

    // 3️⃣ Push job to Redis queue
    await fileQueue.add("process-file", {
      filePath: file.path,
      jobId: jobId,
    });

    res.json({
      jobId,
      status: "pending",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
