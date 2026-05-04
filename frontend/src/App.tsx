import { useState, useEffect } from "react";

export default function App() {
  interface Vitals {
    id: number;
    name: string;
    age: number;
    bp: number;
    consciousness: boolean;
    heartRate: number;
    bloodOxygen: number;
  }

  const [vitals, setVitals] = useState<Vitals[]>([]);

  useEffect(() => {
    fetch("https://pulse-lite.onrender.com/vitals")
      .then((res) => res.json())
      .then((data) => setVitals(data));
  }, []);
  return (
    <>
      <div>
        {vitals.map((v) => (
          <ul key={v.id}>
            <li>name: {v.name}</li>
            <li>age: {v.age}</li>
            <li>bp: {v.bp}</li>
            <li>consciousness: {v.consciousness ? "yes" : "no"}</li>
            <li>heart Rate: {v.heartRate}</li>
            <li>Blood Oxygen: {v.bloodOxygen}</li>
          </ul>
        ))}
      </div>
    </>
  );
}
