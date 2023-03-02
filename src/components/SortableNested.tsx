import { FC, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import { v4 as uuidv4 } from "uuid";

interface Item {
  id: number;
  name: string;
  hidden: boolean;
  parentId?: number;
}

interface Thing extends Item {
  parentId: number | undefined;
}

interface Section extends Item {
  parentId: undefined;
  children: Thing[];
}

const initialItems: (Thing | Section)[] = [
  {
    id: 1,
    name: "Thing 1",
    hidden: false,
    parentId: undefined,
  },
  {
    id: 2,
    name: "Section 1",
    hidden: false,
    parentId: undefined,
    children: [
      {
        id: 3,
        name: "Thing 2",
        hidden: false,
        parentId: 2,
      },
      {
        id: 4,
        name: "Thing 3",
        hidden: false,
        parentId: 2,
      },
      {
        id: 5,
        name: "Thing 4",
        hidden: false,
        parentId: 2,
      },
    ],
  },
  {
    id: 6,
    name: "Section 2",
    hidden: false,
    parentId: undefined,
    children: [
      {
        id: 7,
        name: "Thing 5",
        hidden: false,
        parentId: 6,
      },
    ],
  },
  {
    id: 8,
    name: "Section 3",
    hidden: false,
    parentId: undefined,
    children: [
      {
        id: 9,
        name: "Thing 6",
        hidden: false,
        parentId: 8,
      },
      {
        id: 10,
        name: "Thing 7",
        hidden: false,
        parentId: 8,
      },
    ],
  },
  {
    id: 11,
    name: "Section 4",
    hidden: false,
    parentId: undefined,
    children: [
      {
        id: 12,
        name: "Thing 8",
        hidden: false,
        parentId: 11,
      },
      {
        id: 13,
        name: "Thing 9",
        hidden: false,
        parentId: 11,
      },
      {
        id: 14,
        name: "Thing 10",
        hidden: false,
        parentId: 11,
      },
    ],
  },
];

const SortableStepOne: FC = () => {
  const [items, setItems] = useState<(Thing | Section)[]>(initialItems);

  const addThing = () => {
    const id = Math.floor(Math.random() * 100000);
    const newThing: Thing = {
      id: id,
      name: id.toString(),
      hidden: false,
      parentId: undefined,
    };
    setItems([...items, newThing]);
  };

  const addChildToSection = (parentId: number | undefined) => {
    const randomId = Math.floor(Math.random() * 100000);
    const newThing: Thing = {
      id: randomId,
      name: randomId.toString(),
      hidden: false,
      parentId,
    };
    setItems(
      items.map((item) => {
        if (item.id === parentId) {
          const section = item as Section;
          return {
            ...section,
            children: [...section.children, newThing],
          };
        }
        return item;
      })
    );
  };

  const addSection = () => {
    const randomId = Math.floor(Math.random() * 100000);
    const newSection: Section = {
      id: randomId,
      name: randomId.toString(),
      hidden: false,
      parentId: undefined,
      children: [],
    };
    setItems([...items, newSection]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id && item.parentId !== id));
  };

  const editItem = (id: number, newName: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, name: newName } : item))
    );
  };

  const toggleItemVisibility = (id: number, hidden: boolean) => {
    const updateItem = (items: (Thing | Section)[]): (Thing | Section)[] => {
      return items.map((item) => {
        if (item.id === id) {
          return { ...item, hidden: hidden };
        } else if ((item as Section).children !== undefined) {
          const section = item as Section;
          return {
            ...section,
            children: updateItem(section.children),
          };
        } else {
          return item;
        }
      });
    };
    setItems(updateItem(items));
  };

  const removeChildFromSection = (parentId: number, childId: number) => {
    setItems(
      items.map((item) => {
        if (item.id === parentId) {
          const section = item as Section;
          return {
            ...section,
            children: section.children.filter((child) => child.id !== childId),
          };
        }
        return item;
      })
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
        <button
          className="px-4 py-2 ml-2 text-white bg-blue-500 rounded-md shadow-md hover"
          onClick={addSection}
        >
          Add Section
        </button>
      </div>
      <ReactSortable
        list={items}
        setList={setItems}
        className="flex flex-col gap-2 p-2"
      >
        {items.map((item) => {
          if (item.parentId !== undefined) {
            // render thing inside section
            return (
              <div
                key={item.id}
                className={`${
                  item.hidden ? "line-through opacity-50" : ""
                } bg-gray-200 p-4 rounded-lg shadow-md cursor-move`}
              >
                <div className="flex items-center justify-between">
                  <div>{item.name}</div>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-500 hover:underline focus:outline-none"
                      onClick={() =>
                        editItem(
                          item.id,
                          prompt("Enter new thing name:", item.name) ||
                            item.name
                        )
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline focus:outline-none"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                    <button
                      className="text-gray-500 hover:underline focus:outline-none"
                      onClick={() =>
                        toggleItemVisibility(item.id, !item.hidden)
                      }
                    >
                      {item.hidden ? "Unhide" : "Hide"}
                    </button>
                  </div>
                </div>
              </div>
            );
          } else if ((item as Section).children !== undefined) {
            // render section with nested things
            const section = item as Section;
            return (
              <div
                key={section.id}
                className={`${
                  section.hidden ? "line-through opacity-50" : ""
                } bg-gray-200 p-4 rounded-lg shadow-md cursor-move`}
              >
                <div className="flex items-center justify-between">
                  <div>{section.name}</div>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-500 hover:underline focus:outline-none"
                      onClick={() =>
                        editItem(
                          section.id,
                          prompt("Enter new section name:", section.name) ||
                            section.name
                        )
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline focus:outline-none"
                      onClick={() => removeItem(section.id)}
                    >
                      Remove
                    </button>
                    <button
                      className="text-gray-500 hover:underline focus:outline-none"
                      onClick={() =>
                        toggleItemVisibility(section.id, !section.hidden)
                      }
                    >
                      {section.hidden ? "Unhide" : "Hide"}
                    </button>
                  </div>
                </div>
                <ReactSortable
                  list={section.children}
                  setList={(newChildren) =>
                    setItems(
                      items.map((item) =>
                        item.id === section.id
                          ? { ...section, children: newChildren }
                          : item
                      )
                    )
                  }
                  className="flex flex-col gap-2 p-2 ml-2"
                >
                  {section.children.map((child) => (
                    <div
                      key={child.id}
                      className={`${
                        child.hidden ? "line-through opacity-50" : ""
                      } bg-gray-200 p-4 rounded-lg shadow-md cursor-move`}
                    >
                      <div className="flex items-center justify-between">
                        <div>{child.name}</div>
                        <div className="flex gap-2">
                          <button
                            className="text-blue-500 hover:underline focus:outline-none"
                            onClick={() =>
                              editItem(
                                child.id,
                                prompt("Enter new thing name:", child.name) ||
                                  child.name
                              )
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-500 hover:underline focus:outline-none"
                            onClick={() =>
                              removeChildFromSection(section.id, child.id)
                            }
                          >
                            Remove
                          </button>
                          <button
                            className="text-gray-500 hover:underline focus:outline-none"
                            onClick={() =>
                              toggleItemVisibility(child.id, !child.hidden)
                            }
                          >
                            {child.hidden ? "Unhide" : "Hide"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </ReactSortable>
                <div className="flex justify-end mt-2">
                  <button
                    className="px-4 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none"
                    onClick={() => addChildToSection(section.id)}
                  >
                    Add Thing
                  </button>
                </div>
              </div>
            );
          } else {
            // render top-level thing
            return (
              <div
                key={item.id}
                className={`${
                  item.hidden ? "line-through opacity-50" : ""
                } bg-gray-200 p-4 rounded-lg shadow-md cursor-move`}
              >
                <div className="flex items-center justify-between">
                  <div>{item.name}</div>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-500 hover:underline focus:outline-none"
                      onClick={() =>
                        editItem(
                          item.id,
                          prompt("Enter new thing name:", item.name) ||
                            item.name
                        )
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline focus:outline-none"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                    <button
                      className="text-gray-500 hover:underline focus:outline-none"
                      onClick={() =>
                        toggleItemVisibility(item.id, !item.hidden)
                      }
                    >
                      {item.hidden ? "Unhide" : "Hide"}
                    </button>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </ReactSortable>
    </div>
  );
};

export default SortableStepOne;
