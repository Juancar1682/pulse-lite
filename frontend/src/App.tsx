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

  const [edit, setEdit] = useState<number | null>(null);

  const [editPatient, setEditPatient] = useState<NewPatient>({
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
            <li>
              <button
                onClick={async () => {
                  await fetch(
                    `https://pulse-lite.onrender.com/patient/${v.id}`,
                    {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                    },
                  );
                  setVitals(vitals.filter((vit) => vit.id !== v.id));
                }}
              >
                X
              </button>
            </li>
            <li>
              <button
                onClick={async () => {
                  setEdit(v.id);
                  setEditPatient({
                    name: v.name,
                    age: v.age,
                    bp: v.bp,
                    consciousness: v.consciousness,
                    heartRate: v.heartRate,
                    bloodOxygen: v.bloodOxygen,
                  });
                }}
              >
                edit
              </button>
            </li>

            {edit === v.id && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  const response = await fetch(
                    `https://pulse-lite.onrender.com/patient/${v.id}`,
                    {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(editPatient),
                    },
                  );
                  const data = await response.json();

                  setVitals(
                    vitals.map((vit) => {
                      if (vit.id === v.id) {
                        return data;
                      } else return vit;
                    }),
                  );

                  setEdit(null);
                }}
              >
                <input
                  value={editPatient.name}
                  placeholder="name"
                  onChange={(e) =>
                    setEditPatient({ ...editPatient, name: e.target.value })
                  }
                />
                <input
                  value={editPatient.age}
                  onChange={(e) =>
                    setEditPatient({
                      ...editPatient,
                      age: Number(e.target.value),
                    })
                  }
                />
                <input
                  value={editPatient.bp}
                  onChange={(e) =>
                    setEditPatient({
                      ...editPatient,
                      bp: Number(e.target.value),
                    })
                  }
                />
                <input
                  type="checkbox"
                  checked={editPatient.consciousness}
                  onChange={(e) =>
                    setEditPatient({
                      ...editPatient,
                      consciousness: e.target.checked,
                    })
                  }
                />
                <input
                  value={editPatient.heartRate}
                  onChange={(e) =>
                    setEditPatient({
                      ...editPatient,
                      heartRate: Number(e.target.value),
                    })
                  }
                />
                <input
                  value={editPatient.bloodOxygen}
                  onChange={(e) =>
                    setEditPatient({
                      ...editPatient,
                      bloodOxygen: Number(e.target.value),
                    })
                  }
                />

                <button type="submit">Save</button>
              </form>
            )}
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
          setNewPatient({
            name: "",
            age: 0,
            bp: 0,
            consciousness: false,
            heartRate: 0,
            bloodOxygen: 0,
          });
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
