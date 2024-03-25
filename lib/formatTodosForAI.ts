type simplifiedTodos = {
    [key in TypedColumn]: string[]
}

const formatTodosForAI= (board: Board) => {
    const arrayOfColumns = Array.from(board.columns.entries())

    const flatArray = arrayOfColumns.reduce((map, [key, value]) => {
        map[key] = value.todos
        return map
    }, {} as { [key in TypedColumn]: Todo[]})

    //reduce for AI to key: value(length)
    const flatArrayCounted = Object.entries(flatArray).reduce(
        (map, [key, value]) => {
            map[key as TypedColumn] = value.reduce((extractedTitles, todo) => {
                extractedTitles.push(todo.title)
               return extractedTitles
            }, [] as string[])
            return map
        },
        {} as simplifiedTodos
    )
    return flatArrayCounted
}

export default formatTodosForAI