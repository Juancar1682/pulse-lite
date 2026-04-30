import express from "express";

const app = express();

app.get("/vitals", (req, res) =>
  res.json({
    bp: 100,
    conciousness: true,
    heartRate: 65,
    blodOxygen: 98,
  }),
);

app.listen(3030, () => console.log("server running in PORT 3030"));
