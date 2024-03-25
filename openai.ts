const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const endpoint = process.env["AZURE_OPENAI_ENDPOINT"] ;
const azureApiKey = process.env["AZURE_OPENAI_API_KEY"] ;

const client = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));
export default client

