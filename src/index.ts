import express from "express";
import env from "dotenv";
import { Pool } from "pg";
import cors from "cors";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { z } from "zod";

env.config();
const db = process.env.DATABASE_URL;
const pool = new Pool({ connectionString: db });

const app = express();

const server = http.createServer(app);
const wss = new WebSocketServer({ server });
server.listen(3030, () => console.log("server running in PORT 3030"));
wss.on("connection", async (ws) =>
  ws.send(
    JSON.stringify({
      type: "connected",
      data: (await pool.query('SELECT * from "vitals"')).rows,
    }),
  ),
);

// const VitalsSchema = z.object({
//   name: z.string(),
//   age: z.number().min(0).max(120),
//   bp: z.number().min(60).max(180),
//   consciousness: z.boolean(),
//   heartRate: z.number().min(60).max(180),
//   bloodOxygen: z.number().min(75).max(100),
// });

const PatientSchema = z.object({
  name: z.string(),
  dob: z.string().date(),
});

const VitalsSchema = z.object({
  bp: z.number().min(60).max(180),
  consciousness: z.boolean(),
  heartRate: z.number().min(60).max(180),
  bloodOxygen: z.number().min(75).max(100),
});

type Vitals = z.infer<typeof VitalsSchema>;

app.use(express.json());
app.use(cors());

app.post("/patients", async (req, res) => {
  const obj = PatientSchema.safeParse(req.body);

  if (obj.success === false) {
    return res.status(400).json("Invalid field input");
  }
  const { name, dob } = obj.data;
  try {
    const newPatient = (
      await pool.query(
        `INSERT INTO "patients" (
        "name", 
        "dob" )
       VALUES(
       $1,
       $2
    )
    RETURNING *`,
        [name, dob],
      )
    ).rows[0];
    res.json(newPatient);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "created", data: newPatient }));
      }
    }
  } catch (err) {
    res.status(500).json("500 Internal Server Error");
  }
});

app.post("/patients/:id/readings", async (req, res) => {
  const patientId = Number(req.params.id);

  const obj = VitalsSchema.safeParse(req.body);

  if (isNaN(patientId)) {
    return res.status(400).json("Invalid patient ID");
  }
  if (obj.success === false) {
    return res.status(400).json("Invalid field input");
  }

  const { bp, consciousness, heartRate, bloodOxygen } = obj.data;
  try {
    const newVitals = (
      await pool.query(
        `INSERT INTO "vitals_readings" (
          "patient_id",
          "bp",
          "consciousness",
          "heart_rate",
          "blood_oxygen"
        )
        VALUES(
          $1,
          $2,
          $3,
          $4,
          $5
        )
        RETURNING *`,
        [patientId, bp, consciousness, heartRate, bloodOxygen],
      )
    ).rows[0];
    res.json(newVitals);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({ type: "vitals_created", data: newVitals }),
        );
      }
    }
  } catch (err) {
    res.status(500).json("500 Internal Server Error");
  }
});

// app.post("/patient", async (req, res) => {
//   const obj = VitalsSchema.safeParse(req.body);

//   if (obj.success === false) {
//     return res.status(400).json("Invalid field input");
//   }
//   const { name, age, consciousness, bp, heartRate, bloodOxygen } = obj.data;
//   try {
//     const newPatient = (
//       await pool.query(
//         `INSERT INTO "vitals" (
//         "name",
//         "age",
//         "consciousness",
//         "bp",
//         "heartRate",
//         "bloodOxygen" )
//        VALUES(
//        $1,
//        $2,
//        $3,
//        $4,
//        $5,
//        $6
//     )
//     RETURNING *`,
//         [name, age, consciousness, bp, heartRate, bloodOxygen],
//       )
//     ).rows[0];
//     res.json(newPatient);
//     for (const client of wss.clients) {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(JSON.stringify({ type: "created", data: newPatient }));
//       }
//     }
//   } catch (err) {
//     res.status(500).json("500 Internal Server Error");
//   }
// });

app.get("/vitals", async (req, res) =>
  res.json((await pool.query('SELECT * from "vitals"')).rows),
);

app.put("patient/:id", async (req, res) => {
  const patientId = Number(req.params.id);
  if (isNaN(patientId)) {
    return res.status(400).json("Invalid patient ID");
  }

  const obj = PatientSchema.safeParse(req.body);
  if (obj.success === false) {
    return res.status(400).json("Invalid input data");
  }

  const { name, dob } = obj.data;

  try {
    const updatePatient = (
      await pool.query(
        `UPDATE "Patients"
        SET
        "name" = $1
        "dob" = $2
        RETURNING *`,
        [name, dob],
      )
    ).rows[0];
    res.json(updatePatient);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "updated", data: updatePatient }));
      }
    }
  } catch (err) {
    res.status(500).json("500 Internal Server Error");
  }
});

app.put("/patients/:id", async (req, res) => {
  const patientId = Number(req.params.id);
  if (isNaN(patientId)) {
    return res.status(400).json("Invalid patient ID");
  }
  const obj = VitalsSchema.safeParse(req.body);
  if (obj.success === false) {
    return res.status(400).json("Invalid Input Data");
  }
  const { consciousness, bp, heartRate, bloodOxygen } = obj.data;
  try {
    const updatePatient = (
      await pool.query(
        `UPDATE "vitals"
        SET  
        "consciousness" = $3, 
        "bp" = $4, 
        "heartRate" = $5, 
        "bloodOxygen" = $6
        WHERE id = $7
        RETURNING *`,
        [consciousness, bp, heartRate, bloodOxygen, patientId],
      )
    ).rows[0];
    res.json(updatePatient);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "updated", data: updatePatient }));
      }
    }
  } catch (err) {
    res.status(500).json("500 Internal Server Error");
  }
});

app.delete("/patient/:id", async (req, res) => {
  const paramsId = Number(req.params.id);
  if (isNaN(paramsId)) {
    return res.status(400).json("Invalid patient ID");
  }
  try {
    const deletePatient = (
      await pool.query(
        `DELETE from "vitals"
            WHERE id = $1
            RETURNING *`,
        [paramsId],
      )
    ).rows[0];
    res.json(deletePatient);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ type: "deleted", data: paramsId }));
      }
    }
  } catch (err) {
    res.status(500).json("500 Internal Server Eror");
  }
});
