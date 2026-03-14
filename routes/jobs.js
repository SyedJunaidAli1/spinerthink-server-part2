import express from "express";
import pool from "../config/db.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const jobId = req.params.id;

    const result = await pool.query(
      "SELECT id, status, progress FROM jobs WHERE id=$1",
      [jobId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json({
      jobId: result.rows[0].id,
      status: result.rows[0].status,
      progress: result.rows[0].progress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch job status" });
  }
});

export default router;
