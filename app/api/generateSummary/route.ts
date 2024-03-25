import client from "@/openai";

export async function POST(request: Request) {
  //todos in the body of the POST request
  const { todos } = await request.json()

  //communicate with openAI
  const prompt = [
    {
      role: "system",
      content: `When responding, welcome the user always with as Mandarine and say welcome to Todo demo App!
      Always give the number of tasks in each category and make a summary for each category. Alsways respond in english
          Limit the response to 300 characters`,
    },
    {
      role: "user",
      content: `Hi there, provide a summary of the following todos. Count how many todos are in each category such as To do, in progrss, or done, 
          then tell the user to have a productive day! Here's the data: ${JSON.stringify(
            todos
          )}`,
    },
  ]
  const deploymentId = "gpt-4";
  const result = await client.getChatCompletions(deploymentId, prompt);

  return Response.json(result.choices[0].message)
}
