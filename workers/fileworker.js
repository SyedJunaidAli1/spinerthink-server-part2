import { Worker } from "bullmq";
import fs from "fs";
import connection from "../config/redis.js";

const worker = new Worker(
  "file-processing",
  async (job) => {
    const { filePath } = job.data;

    const text = fs.readFileSync(filePath, "utf-8");

    const words = text.split(/\s+/).filter(Boolean);
    const paragraphs = text.split(/\n+/).filter(Boolean);

    const wordCount = words.length;
    const paragraphCount = paragraphs.length;

    const keywordMap = {};

    words.forEach((word) => {
      word = word.toLowerCase();

      keywordMap[word] = (keywordMap[word] || 0) + 1;
    });

    const topKeywords = Object.entries(keywordMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((k) => k[0]);

    return {
      wordCount,
      paragraphCount,
      topKeywords
    };
  },
  { connection }
);

worker.on("completed", (job, result) => {
  console.log("Job completed:", result);
});

worker.on("failed", (job, err) => {
  console.log("Job failed:", err);
});