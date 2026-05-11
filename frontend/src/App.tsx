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

  useEffect(() => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);
    ws.onmessage = (event) => {
      const { data, type } = JSON.parse(event.data);

      if (type === "connected") {
        setVitals(data);
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
    return () => ws.close();
  }, []);

  return (
    <>
      <div className="bg-gray-200 flex flex-col gap-4">
        {vitals.map((v) => (
          <ul
            key={v.id}
            className="flex flex-col p-4 border-2 rounded-lg shadow-md m-4"
          >
            <div className="flex gap-2 items-end mb-2">
              <li className="text-2xl font-bold text-gray-700">{v.name}</li>
              <li className="text-gray-400">Age: {v.age}</li>
            </div>

            <div className="grid grid-cols-2 text-mist-600 font-light">
              <li>Blood Preassure: {v.bp}</li>
              <li>Consciousness: {v.consciousness ? "Yes" : "No"}</li>
              <li>Heart Rate: {v.heartRate}</li>
              <li>Blood Oxygen: {v.bloodOxygen}</li>
            </div>
            <div className="flex gap-4 mt-2">
              <li>
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
              </li>
              <li className="">
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
              </li>
            </div>

            {edit === v.id && (
              <form
                className="grid grid-cols-2 p-4 border-2 rounded-lg shadow-md m-4"
                onSubmit={async (e) => {
                  e.preventDefault();

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
          </ul>
        ))}

        <form
          className="grid grid-cols-2 p-4 border-2 rounded-lg shadow-md m-4"
          onSubmit={async (e) => {
            e.preventDefault();

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
