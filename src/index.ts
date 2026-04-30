import express from "express";

const app = express();

interface Vitals {
  bp: number;
  consciousness: boolean;
  heartRate: number;
  bloodOxygen: number;
}

const juanVitals: Vitals = {
  bp: 100,
  consciousness: true,
  heartRate: 65,
  bloodOxygen: 98,
};

app.get("/vitals", (req, res) => res.json(juanVitals));

app.listen(3030, () => console.log("server running in PORT 3030"));
