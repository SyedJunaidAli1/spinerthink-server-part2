import { Queue } from "bullmq";
import connection from "../config/redis";

const fileQueue = new Queue("file-processing", { connection });

export default fileQueue;
