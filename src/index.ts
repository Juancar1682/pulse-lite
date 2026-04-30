import express from "express";
import env from "dotenv";
import { Pool } from "pg";

env.config();
const db = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: db });

const app = express();

interface Vitals {
  bp: number;
  consciousness: boolean;
  heartRate: number;
  bloodOxygen: number;
}

app.get("/vitals", async (req, res) =>
  res.json((await pool.query('SELECT * from "vitals"')).rows),
);

app.listen(3030, () => console.log("server running in PORT 3030"));
