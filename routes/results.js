import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/:jobId", async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const result = await pool.query(
      "SELECT job_id, word_count, paragraph_count, keywords FROM results WHERE job_id=$1",
      [jobId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Result not found" });
    }

    res.json({
      jobId: result.rows[0].job_id,
      wordCount: result.rows[0].word_count,
      paragraphCount: result.rows[0].paragraph_count,
      topKeywords: result.rows[0].keywords,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch result" });
  }
});

export default router;
