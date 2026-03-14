import "dotenv/config";
import pool from "./config/db.js";

async function test() {
  const res = await pool.query("SELECT NOW()");
  console.log(res.rows);
}

test();
