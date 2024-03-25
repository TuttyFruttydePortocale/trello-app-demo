import React, { Dispatch, SetStateAction } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import TodoCard from "./TodoCard";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useBoardStore } from "@/store/BoardStore";

type Props = {
  id: TypedColumn;
  todos: Todo[];
  index: number;
};

const titleOfColumnNicer: { [key in TypedColumn]: string } = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

function ColumnDisplay({ id, todos, index }: Props) {
  //get the search string
  const [searchString, setIsOpenPopUpState] = useBoardStore((state) => [
    state.searchString,
    state.setIsOpenPopUpState,
  ]);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="flex-col flex-1 text-lg font-light pl-5 
          p-5 shadow-xl rounded-3xl bg-white text-black text-center"
        >
          {/*render droppable todos in the column*/}
          <Droppable droppableId={index.toString()} type="card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`p-2 rounded-2xl shadow-sm 
                    ${
                      snapshot.isDraggingOver ? "bg-green-100" : "bg-white/50"
                    }`}
              >
                {/* numbers of todos in a column */}
                <h2 className="flex justify-between font-bold text-xl p-2">
                  {titleOfColumnNicer[id]}
                  <span
                    className="text-gray-500 bg-gray-200 rounded-full px-2
                py-1 text-sm font-normal"
                  >
                    {!searchString
                      ? todos.length
                      : todos.filter((todo) =>
                          todo.title
                            .toLowerCase()
                            .includes(searchString.toLowerCase())
                        ).length}
                  </span>
                </h2>
                <div className="space-y-2">
                  {todos.map((todo, index) => {
                    if (
                      searchString &&
                      !todo.title
                        .toLowerCase()
                        .includes(searchString.toLowerCase())
                    )
                      return null;
                    return (
                      <Draggable
                        key={todo.$id}
                        draggableId={todo.$id}
                        index={index}
                      >
                        {(provided) => (
                          <TodoCard
                            todo={todo}
                            taskIndex={index}
                            onColumn={id}
                            innerRef={provided.innerRef}
                            draggableProps={provided.draggableProps}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        )}
                      </Draggable>
                    );
                  })}
                  {/* creating a spaceholder - creates the necessary space for when dragging 
                    over another column */}

                  {provided.placeholder}

                  <div className="flex items-end justify-end p-2">
                    <button
                      onClick={(e) => setIsOpenPopUpState(true, id)}
                      className={`text-green-300 hover:text-green-600 
                    ${
                      snapshot.isDraggingOver
                        ? "text-green-600"
                        : "text-green-300"
                    }`}
                    >
                      <PlusCircleIcon className="h-10 w-10" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
}

export default ColumnDisplay;
