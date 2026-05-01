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

app.use(express.json());

app.post("/patient", async (req, res) => {
  const { name, age, consciousness, bp, heartRate, bloodOxygen } = req.body;
  if (age < 0 || age > 120) {
    return res.status(400).json("Invalid age number");
  }
  if (bp < 60 || bp > 160) {
    return res.status(400).json("Invalid bp number");
  }
  if (heartRate < 60 || heartRate > 180) {
    return res.status(400).json("Invalid heartRate number");
  }
  if (bloodOxygen < 75 || bloodOxygen > 100) {
    return res.status(400).json("Invalid bloodOxygen number");
  }
  res.json(
    (
      await pool.query(
        `INSERT INTO "vitals" (
        "name", 
        "age", 
        "consciousness", 
        "bp", 
        "heartRate", 
        "bloodOxygen" )
       VALUES(
       $1,
       $2,
       $3,
       $4,
       $5,
       $6
    )
    RETURNING *`,
        [name, age, consciousness, bp, heartRate, bloodOxygen],
      )
    ).rows[0],
  );
});

app.get("/vitals", async (req, res) =>
  res.json((await pool.query('SELECT * from "vitals"')).rows),
);

app.listen(3030, () => console.log("server running in PORT 3030"));
