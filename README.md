# Policy Navigator

This repo contains sample code for a simple chat webapp that integrates with Azure OpenAI. 

This app is configured to allow Retrieval Augmented Generation (RAG) based on the main IOM Policy documents.

It is based on [Microsoft's Azure OpenAI sample]((https://github.com/microsoft/sample-app-aoai-chatGPT)

We are using the cosmosdb vector index to store the embeddings of the policy documents.

To test locally, set the corresponding environment variables in a `.env` file. and run .\start.cmd on windows or `./start.sh` on linux.

