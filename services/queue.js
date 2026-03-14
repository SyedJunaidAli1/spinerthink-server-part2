import { Queue } from "bullmq";
import connection from "../config/redis.js";

const fileQueue = new Queue("file-processing", { connection });

export default fileQueue;
