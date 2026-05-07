import express from "express";
import env from "dotenv";
import { Pool } from "pg";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";

env.config();
const db = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: db });

const app = express();

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
server.listen(3030, () => console.log("server running in PORT 3030"));
wss.on("connection", (ws) => console.log("Websocket is on"));

interface Vitals {
  bp: number;
  consciousness: boolean;
  heartRate: number;
  bloodOxygen: number;
}

app.use(express.json());
app.use(cors());

app.post("/patient", async (req, res) => {
  const { name, age, consciousness, bp, heartRate, bloodOxygen } = req.body;
  if (
    !age ||
    !name ||
    !bp ||
    !heartRate ||
    !bloodOxygen ||
    consciousness == null
  ) {
    return res.status(400).json("All fields are required");
  }
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
  try {
    const newPatient = (
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
    ).rows[0];
    res.json(newPatient);
    for (const client of wss.clients) {
      client.send(JSON.stringify(newPatient));
    }
  } catch (err) {
    res.status(500).json("500 Internal Server Error");
  }
});

app.get("/vitals", async (req, res) =>
  res.json((await pool.query('SELECT * from "vitals"')).rows),
);

app.put("/patient/:id", async (req, res) => {
  const patientId = req.params.id;
  const { name, age, consciousness, bp, heartRate, bloodOxygen } = req.body;
  try {
    res.json(
      (
        await pool.query(
          `UPDATE "vitals"
        SET 
        "name" = $1, 
        "age" = $2, 
        "consciousness" = $3, 
        "bp" = $4, 
        "heartRate" = $5, 
        "bloodOxygen" = $6
        WHERE id = $7
        RETURNING *`,
          [name, age, consciousness, bp, heartRate, bloodOxygen, patientId],
        )
      ).rows[0],
    );
  } catch (err) {
    res.status(500).json("500 Internal Server Error");
  }
});

app.delete("/patient/:id", async (req, res) => {
  const paramsId = req.params.id;
  try {
    res.json(
      (
        await pool.query(
          `DELETE from "vitals"
            WHERE id = $1
            RETURNING *`,
          [paramsId],
        )
      ).rows[0],
    );
  } catch (err) {
    res.status(500).json("500 Internal Server Eror");
  }
});
