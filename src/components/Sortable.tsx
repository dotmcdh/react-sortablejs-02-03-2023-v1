import { FC, useState } from "react";
import { ReactSortable } from "react-sortablejs";

interface ThingType {
  id: number;
  name: string;
  hidden: boolean;
}

const BasicFunction: FC = () => {
  const [things, setThings] = useState<ThingType[]>([
    { id: 1, name: "shrek", hidden: false },
    { id: 2, name: "fiona", hidden: false },
  ]);

  const addThing = () => {
    const newId = things.length + 1;
    const newThing = { id: newId, name: `thing ${newId}`, hidden: false };
    setThings([...things, newThing]);
  };

  const removeThing = (id: number) => {
    setThings(things.filter((thing) => thing.id !== id));
  };

  const editThing = (id: number, newName: string) => {
    setThings(
      things.map((thing) =>
        thing.id === id ? { ...thing, name: newName } : thing
      )
    );
  };

  const toggleThingVisibility = (id: number, hidden: boolean) => {
    setThings(
      things.map((thing) =>
        thing.id === id ? { ...thing, hidden: hidden } : thing
      )
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-end mb-2">
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
          onClick={addThing}
        >
          Add Thing
        </button>
      </div>
      <ReactSortable
        list={things}
        setList={setThings}
        className="flex flex-col gap-2 p-2"
      >
        {things.map((thing) => (
          <div
            key={thing.id}
            className={`${
              thing.hidden ? "line-through opacity-50" : ""
            } bg-gray-200 p-4 rounded-lg shadow-md cursor-move`}
          >
            <div className="flex items-center justify-between">
              <div>{thing.name}</div>
              <div className="flex gap-2">
                <button
                  className="text-blue-500 hover:underline focus:outline-none"
                  onClick={() =>
                    editThing(
                      thing.id,
                      prompt("Enter new thing name:", thing.name) || thing.name
                    )
                  }
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:underline focus:outline-none"
                  onClick={() => removeThing(thing.id)}
                >
                  Remove
                </button>
                <button
                  className="text-gray-500 hover:underline focus:outline-none"
                  onClick={() => toggleThingVisibility(thing.id, !thing.hidden)}
                >
                  {thing.hidden ? "Unhide" : "Hide"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </ReactSortable>
    </div>
  );
};

export default BasicFunction;
