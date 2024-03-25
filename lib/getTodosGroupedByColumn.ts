import { databases } from "@/appwrite";
import { Models } from "appwrite";

interface todoData extends Models.Document {
  title: string;
  image: string;
  status: string;
}
export const getTodosGroupedByColumn = async (): Promise<Board> => {
  const data: Models.DocumentList<todoData> = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
  );
  let allTasks= todoListDTO(data.documents)
  let todoColumn = createColumnForTodos(allTasks, 'todo')
  let inProgressColumn = createColumnForTodos(allTasks, 'inprogress')
  let doneColumn = createColumnForTodos(allTasks, 'done')

  let columnMap: Map<TypedColumn, Column> = new Map
  columnMap.set('todo', todoColumn)
  columnMap.set('inprogress', inProgressColumn)
  columnMap.set('done', doneColumn)
  
  let boardCreation: Board = {
    columns: columnMap
  }
  return boardCreation
};
//DTO = Data to Object
function todoListDTO(dataToConvert: todoData[]): Todo[] {
  let allTasks: Todo[] = [];
  dataToConvert.forEach((elementOfArray) => {
    let image = elementOfArray.image ? JSON.parse(elementOfArray.image) : undefined
    let taskProperties: Todo = {
      $createdAt: elementOfArray.$createdAt,
      $id: elementOfArray.$id,
      title: elementOfArray.title,
      status: elementOfArray.status as TypedColumn,
      image: image
      // image: element.image
    };
    allTasks.push(taskProperties)
  });

  return allTasks;
}

function createColumnForTodos(allTasks: Todo[], colomnId: TypedColumn): Column{
    let column: Column = {
        id: colomnId,
        todos: []
    }
    let filteredTasks = allTasks.filter((elementOfArray)=>elementOfArray.status == colomnId)
    column.todos = filteredTasks
    return column
}
