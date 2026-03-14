import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("File Processing System API");
});

const PORT = process.env.PORT;

import uploadRoutes from "./routes/upload.js";
import jobRoutes from "./routes/jobs.js";
import resultRoutes from "./routes/results.js";

app.use("/jobs", jobRoutes);
app.use("/results", resultRoutes);
app.use("/upload", uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
