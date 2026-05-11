import { useState, useEffect } from "react";
import { LuPencil } from "react-icons/lu";

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

export default function App() {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    let delay = 1000;
    let ws: WebSocket | undefined = undefined;
    function connect() {
      ws = new WebSocket(import.meta.env.VITE_WS_URL);

      ws.onmessage = (event) => {
        const { data, type } = JSON.parse(event.data);

        if (type === "connected") {
          setVitals(data);
          setLoading(false);
        }

        if (type === "created") {
          setVitals((prev) => [...prev, data]);
        }

        if (type === "updated") {
          setVitals((prev) =>
            prev.map((vit) => {
              if (vit.id === data.id) {
                return data;
              } else return vit;
            }),
          );
        }

        if (type === "deleted") {
          setVitals((prev) => prev.filter((vit) => vit.id !== Number(data)));
        }
      };
      ws.onerror = () => setError(true);

      ws.onclose = () => {
        delay = Math.min(delay * 2, 30000);
        setTimeout(() => connect(), delay);
      };
    }
    connect();
    return () => ws?.close();
  }, []);

  return (
    <>
      {loading && <p>Connecting...</p>}
      {error && <p>Live connection failed...</p>}
      <div className="bg-gray-200 flex flex-col gap-4">
        {vitals.map((v) => (
          <article
            key={v.id}
            className="flex flex-col p-4 border-2 rounded-lg shadow-md m-4"
          >
            <div className="flex gap-2 items-end mb-2">
              <p className="text-2xl font-bold text-gray-700">{v.name}</p>
              <p className="text-gray-400">Age: {v.age}</p>
            </div>

            <div className="grid grid-cols-2 text-mist-600 font-light">
              <p>Blood Preassure: {v.bp}</p>
              <p>Consciousness: {v.consciousness ? "Yes" : "No"}</p>
              <p>Heart Rate: {v.heartRate}</p>
              <p>Blood Oxygen: {v.bloodOxygen}</p>
            </div>
            <div className="flex gap-4 mt-2">
              <button
                className="bg-red-200 p-1 px-2 rounded-md text-red-400 text-sm"
                onClick={async () => {
                  await fetch(
                    import.meta.env.VITE_API_URL + `/patient/${v.id}`,
                    {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                    },
                  );
                }}
              >
                Delete
              </button>

              <button
                className="flex felx-row items-center gap-1 bg-slate-300 p-1 px-2 rounded-md text-slate-500 text-sm"
                onClick={async () => {
                  if (edit === v.id) {
                    setEdit(null);
                  } else {
                    setEdit(v.id);
                  }
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
                <LuPencil className="text-[11px]" />
                Edit
              </button>
            </div>

            {edit === v.id && (
              <form
                className="grid grid-cols-2 p-4 border-2 rounded-lg shadow-md m-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (
                    isNaN(newPatient.age) ||
                    isNaN(newPatient.bp) ||
                    isNaN(newPatient.heartRate) ||
                    isNaN(newPatient.bloodOxygen)
                  ) {
                    return;
                  }
                  const response = await fetch(
                    import.meta.env.VITE_API_URL + `/patient/${v.id}`,
                    {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(editPatient),
                    },
                  );
                  await response.json();

                  setEdit(null);
                }}
              >
                <label className="flex flex-col text-md">
                  Name:
                  <input
                    className="w-15 rounded-sm border pl-1 text-sm py-1 text-gray-600"
                    value={editPatient.name}
                    placeholder="name"
                    onChange={(e) =>
                      setEditPatient({ ...editPatient, name: e.target.value })
                    }
                  />
                </label>

                <label className="flex flex-col text-md">
                  Age:
                  <input
                    className="w-15 rounded-sm border pl-1 text-sm py-1 text-gray-600"
                    value={editPatient.age}
                    type="number"
                    onChange={(e) =>
                      setEditPatient({
                        ...editPatient,
                        age: Number(e.target.value),
                      })
                    }
                  />
                </label>

                <label className="flex flex-col text-md">
                  Blood Preassure:
                  <input
                    className="w-15 rounded-sm border pl-1 text-sm py-1 text-gray-600"
                    value={editPatient.bp}
                    type="number"
                    onChange={(e) =>
                      setEditPatient({
                        ...editPatient,
                        bp: Number(e.target.value),
                      })
                    }
                  />
                </label>

                <label className="flex flex-col text-md">
                  Conscious:
                  <input
                    className="w-15 rounded-sm border pl-1 text-sm py-1 text-gray-600"
                    type="checkbox"
                    checked={editPatient.consciousness}
                    onChange={(e) =>
                      setEditPatient({
                        ...editPatient,
                        consciousness: e.target.checked,
                      })
                    }
                  />
                </label>

                <label className="flex flex-col text-md">
                  Heart Rate:
                  <input
                    className="w-15 rounded-sm border pl-1 text-sm py-1 text-gray-600"
                    value={editPatient.heartRate}
                    type="number"
                    onChange={(e) =>
                      setEditPatient({
                        ...editPatient,
                        heartRate: Number(e.target.value),
                      })
                    }
                  />
                </label>

                <label className="flex flex-col text-md">
                  Blood Oxygen:
                  <input
                    className="w-15 rounded-sm border pl-1 text-sm py-1 text-gray-600"
                    value={editPatient.bloodOxygen}
                    type="number"
                    onChange={(e) =>
                      setEditPatient({
                        ...editPatient,
                        bloodOxygen: Number(e.target.value),
                      })
                    }
                  />
                </label>

                <div className="col-span-2 flex justify-end">
                  <button
                    className="bg-green-300 p-1 px-2 rounded-md text-green-700 text-sm"
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </form>
            )}
          </article>
        ))}

        <form
          className="grid grid-cols-2 p-4 border-2 rounded-lg shadow-md m-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (
              isNaN(newPatient.age) ||
              isNaN(newPatient.bp) ||
              isNaN(newPatient.heartRate) ||
              isNaN(newPatient.bloodOxygen)
            ) {
              return;
            }
            await fetch(import.meta.env.VITE_API_URL + `/patient`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newPatient),
            });

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
          <label className="flex flex-col text-md">
            Name:
            <input
              className="w-15 rounded-sm border pl-1 text-sm py-1 text-gray-600"
              value={newPatient.name}
              placeholder="John"
              onChange={(e) =>
                setNewPatient({ ...newPatient, name: e.target.value })
              }
            />
          </label>

          <label className="flex flex-col text-md">
            Age
            <input
              className="w-15 rounded-sm border pl-1 text-sm py-1 text-gray-600"
              value={newPatient.age}
              type="number"
              onChange={(e) =>
                setNewPatient({ ...newPatient, age: Number(e.target.value) })
              }
            />
          </label>

          <label className="flex flex-col text-md">
            Blood Preasure
            <input
              className="w-15 rounded-sm border pl-1 text-sm py-1 text-gray-600"
              value={newPatient.bp}
              type="number"
              onChange={(e) =>
                setNewPatient({
                  ...newPatient,
                  bp: Number(e.target.value),
                })
              }
            />
          </label>

          <label className="flex flex-col text-md">
            Conscious
            <input
              className="w-15 rounded-sm border pl-1 text-sm py-1 text-gray-600"
              type="checkbox"
              checked={newPatient.consciousness}
              onChange={(e) =>
                setNewPatient({
                  ...newPatient,
                  consciousness: e.target.checked,
                })
              }
            />
          </label>

          <label className="flex flex-col text-md">
            Heart Rate
            <input
              className="w-15 rounded-sm border pl-1 text-sm py-1 text-gray-600"
              value={newPatient.heartRate}
              type="number"
              onChange={(e) =>
                setNewPatient({
                  ...newPatient,
                  heartRate: Number(e.target.value),
                })
              }
            />
          </label>

          <label className="flex flex-col text-md">
            Blood Oxygen
            <input
              className="w-15 rounded-sm border pl-1 text-sm py-1 text-gray-600"
              value={newPatient.bloodOxygen}
              type="number"
              onChange={(e) =>
                setNewPatient({
                  ...newPatient,
                  bloodOxygen: Number(e.target.value),
                })
              }
            />
          </label>

          <div className="col-span-2 flex justify-end">
            <button
              className="bg-green-300 p-1 px-2 rounded-md text-green-700 text-sm"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
