import { databases, ID, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import uploadImage from "@/lib/uploadImage";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;

  isOpenPopUp:boolean
  setIsOpenPopUpState: (newPopUpStateValue: boolean, addedTaskType: TypedColumn) =>void

  createTask: (title: string, status: TypedColumn) => void;
  userInput: string
  setUserInput: (input: string) => void

  addedTaskType: TypedColumn,
  setAddedTaskType: (columnId: TypedColumn) => void

  searchString: string;
  setSearchString: (searchString: string) => void;

  image: File | null
  setImage: (image: File | null) => void

  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void

  deleteTaskOnDB: (
    todo: Todo,
    typeColumn: TypedColumn,
    taskIndex: number
  ) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },
  setBoardState: (board) => set({ board }),

  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      { title: todo.title, status: columnId }
    );
  },
  isOpenPopUp: false,
  setIsOpenPopUpState: async (newPopUpStateValue, addedTaskType) => {
    set({isOpenPopUp: newPopUpStateValue, addedTaskType: addedTaskType})
  },
  createTask: async (title, status) => {
    await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      { title: title, status: status }
    );
  },
  userInput: "",
  setUserInput: (input: string) => set({userInput: input}),

  addedTaskType: "todo",
  setAddedTaskType: (columnId: TypedColumn) => set({addedTaskType: columnId}),

  searchString: "",
  setSearchString: (searchString) => set({ searchString }),

  image: null,
  setImage: (image: File | null) => set({image}),


  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined

    if(image){
      const fileUploaded = await uploadImage(image)
      if(fileUploaded){
        file ={
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        }
      }
    }
    const {$id} = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file &&{image: JSON.stringify(file)})
      }
    )

    set({userInput: ""})
    set((state) => {
      const newColumns = new Map(state.board.columns)

      const newTodo: Todo ={
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file&&{inage: file})
      }
      const column = newColumns.get(columnId)

      if(!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo]
        })
      } else {
        newColumns.get(columnId)?.todos.push(newTodo)
      }
      return {
        board: {
          columns: newColumns
        }
      }
    })
  },
  deleteTaskOnDB: async (
    todo: Todo,
    typeColumn: TypedColumn,
    taskIndex: number
  ) => {
    const copyOfColumns = new Map(get().board.columns);
    copyOfColumns.get(typeColumn)?.todos.splice(taskIndex, 1);
    set({ board: { columns: copyOfColumns } });
    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );
  },
}));
