import { Worker } from "bullmq";
import fs from "fs";
import connection from "../config/redis.js";
import pool from "../config/db.js";

const worker = new Worker(
  "file-processing",
  async (job) => {
    const { filePath, jobId } = job.data;

    // 1️⃣ Mark job as processing
    await pool.query("UPDATE jobs SET status=$1 WHERE id=$2", [
      "processing",
      jobId,
    ]);

    // 2️⃣ Read file
    const text = fs.readFileSync(filePath, "utf-8");

    // 3️⃣ Word + paragraph count
    const words = text.split(/\s+/).filter(Boolean);
    const paragraphs = text.split(/\n+/).filter(Boolean);

    const wordCount = words.length;
    const paragraphCount = paragraphs.length;

    // 4️⃣ Calculate keywords
    const keywordMap = {};

    words.forEach((word) => {
      const w = word.toLowerCase();
      keywordMap[w] = (keywordMap[w] || 0) + 1;
    });

    const topKeywords = Object.entries(keywordMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word);

    // 5️⃣ Save results
    await pool.query(
      "INSERT INTO results (job_id, word_count, paragraph_count, keywords) VALUES ($1,$2,$3,$4)",
      [jobId, wordCount, paragraphCount, topKeywords],
    );

    // 6️⃣ Mark job completed
    await pool.query("UPDATE jobs SET status=$1, progress=$2 WHERE id=$3", [
      "completed",
      100,
      jobId,
    ]);

    return {
      wordCount,
      paragraphCount,
      topKeywords,
    };
  },
  { connection },
);

worker.on("completed", (job, result) => {
  console.log("Job completed:", result);
});

worker.on("failed", (job, err) => {
  console.error("Job failed:", err);
});
