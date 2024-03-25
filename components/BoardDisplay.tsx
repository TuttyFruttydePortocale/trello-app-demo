"use client";

import { useBoardStore } from "@/store/BoardStore";
import { useEffect, useState } from "react";
import ColumnDisplay from "./ColumnDisplay";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import AddTask from "./AddTask";

//de ce aici nu se leaga getBoard cu getBoardFromDatabase
//plus la mine nu si pastreaza state ul dupa drag & drop
function BoardDisplay() {
  const [board, getBoardFromDatabase, setBoardState, updateTodoInDB] =
    useBoardStore((state) => [
      state.board,
      state.getBoard,
      state.setBoardState,
      state.updateTodoInDB,
    ]);
  useEffect(() => {
    getBoardFromDatabase();
  }, [getBoardFromDatabase]);

  {
    /* onDragEnd handles all of the dropping logic
      DropResult contains the source, the destination & the type */
  }

  function handleOnDragEnd(result: DropResult) {
    {
      /*
    destination = where it will be dropped
    source = from where it was dragged
    type = if there was the whole column or just a task dragged
   */
    }

    const { destination, source, type } = result;

    //check if user dragged card outside of its column
    //if it dropps it in the same place, don't do anything
    if (!destination) return;

    //handle on column drag
    if (type === "column") {
      //convert the key-values pair into an array
      const entries = Array.from(board.columns.entries());

      //source.index - which task in the column was dragged
      //source.droppableId - from which column it was dragged
      const [removed] = entries.splice(source.index, 1);

      //destination.index - which task number in the column it will be
      //destination.droppableId - in which column it will be dropped
      entries.splice(destination.index, 0, removed);
      const rearrangeColumns = new Map(entries);
      setBoardState({
        //"..." inseamna spread
        ...board,
        columns: rearrangeColumns,
      });
      return;
    }

    // This step is needed because DND library stores numbers as indexes not id's
    const copyOfColumns = Array.from(board.columns);
    const startColIndex = copyOfColumns[Number(source.droppableId)];
    const finishColIndex = copyOfColumns[Number(destination.droppableId)];

    //parsing the index from number to the name of the column
    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].todos,
    };

    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].todos,
    };

    //daca e undifined e false
    if (!startCol || !finishCol) return;

    //if dragging to the same column, do nothing
    if (source.index === destination.index && startCol === finishCol) return;

    const copyOfTasksInOneColumn = startCol.todos;
    const [todoMoved] = copyOfTasksInOneColumn.splice(source.index, 1);

    if (startCol.id === finishCol.id) {
      //Same column task drag
      copyOfTasksInOneColumn.splice(destination.index, 0, todoMoved);
      const newCol = {
        id: startCol.id,
        todos: copyOfTasksInOneColumn,
      };
      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);

      setBoardState({ ...board, columns: newColumns });
    } else {
      //dragging to another column
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved);

      const newColumns = new Map(board.columns);
      const newCol = {
        id: startCol.id,
        todos: copyOfTasksInOneColumn,
      };

      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, {
        id: finishCol.id,
        todos: finishTodos,
      });

      updateTodoInDB(todoMoved, finishCol.id);
      setBoardState({ ...board, columns: newColumns });
    }
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {/* flex gap-10 pr-7 pl-7 max-w-7xl mx-auto */}
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {/* You are not allowed to map through a map in HTML, you need to transform it into a board */}
            {Array.from(board.columns).map(([id, column], columnIndex) => (
              <ColumnDisplay
                key={id}
                id={id}
                todos={column.todos}
                index={columnIndex}
              />
            ))}
          </div>
        )}
      </Droppable>
      <AddTask/>
    </DragDropContext>
  );
}

export default BoardDisplay;
