import formatTodosForAI from "./formatTodosForAI"

const fetchSuggestion = async(board: Board) => {
    const todos = formatTodosForAI(board)

    // const result = await fetch("/api/generateSummary", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({test: "test"})
    // })
    const result = await fetch("/api/generateSummary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todos }),
      });

    const GPTdata = await result.json()
    const { content } = GPTdata

    return content

}

export default fetchSuggestion