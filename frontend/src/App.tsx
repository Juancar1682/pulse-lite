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

  interface NewPatient {
    name: string;
    age: number;
    bp: number;
    consciousness: boolean;
    heartRate: number;
    bloodOxygen: number;
  }

  const [vitals, setVitals] = useState<Vitals[]>([]);

  const [newPatient, setNewPatient] = useState<NewPatient>({
    name: "",
    age: 0,
    bp: 0,
    consciousness: false,
    heartRate: 0,
    bloodOxygen: 0,
  });

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

      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const response = await fetch(
            "https://pulse-lite.onrender.com/patient",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newPatient),
            },
          );
          setVitals([...vitals, await response.json()]);
        }}
      >
        <input
          value={newPatient.name}
          placeholder="name"
          onChange={(e) =>
            setNewPatient({ ...newPatient, name: e.target.value })
          }
        />
        <input
          value={newPatient.age}
          onChange={(e) =>
            setNewPatient({ ...newPatient, age: Number(e.target.value) })
          }
        />
        <input
          value={newPatient.bp}
          onChange={(e) =>
            setNewPatient({
              ...newPatient,
              bp: Number(e.target.value),
            })
          }
        />
        <input
          type="checkbox"
          checked={newPatient.consciousness}
          onChange={(e) =>
            setNewPatient({ ...newPatient, consciousness: e.target.checked })
          }
        />
        <input
          value={newPatient.heartRate}
          onChange={(e) =>
            setNewPatient({
              ...newPatient,
              heartRate: Number(e.target.value),
            })
          }
        />
        <input
          value={newPatient.bloodOxygen}
          onChange={(e) =>
            setNewPatient({
              ...newPatient,
              bloodOxygen: Number(e.target.value),
            })
          }
        />

        <button type="submit">Submit</button>
      </form>
    </>
  );
}
