interface Board{
    // map Object that will blow my mind
    columns: Map<TypedColumn, Column>
}

type TypedColumn = 'todo' | 'inprogress' | 'done'

interface Column {
    id: TypedColumn,
    todos: Todo[]
}

interface Todo{
    $id: string, //id
    $createdAt: string, //createdAt
    title: string, //title
    status: TypedColumn, //status
    image?: Image //image
}

interface Image{
    bucketId: string,
    fileId: string,
}