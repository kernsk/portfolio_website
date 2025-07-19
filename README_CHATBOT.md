# My Portfolio Chatbot

This is an AI-powered Retrieval-Augmented Generation (RAG) chatbot integrated into my portfolio website. The chatbot uses Gemini and Langchain to provide intelligent responses about my experience, skills, projects, and potential fit with your company.

## Features

- **Modern UI**: Clean, responsive chat interface that matches the portfolio's design
- **Gemini AI Integration**: Uses Google's Gemini 2.5 Flash Lite model for real-time responses and lower cost
- **RAG Architecture**: Retrieves relevant information from a knowledge base before generating responses
- **Real-time Chat**: Nearly instant responses with typing indicators
- **Professional Context**: Focused on my professional background and portfolio

## Technical Details

### RAG Implementation

1. **Document Loading**: Loads knowledge base from text file
2. **Text Splitting**: Chunks text into manageable pieces
3. **Embedding Creation**: Uses HuggingFace embeddings for similarity search
4. **Vector Storage**: FAISS vector database for efficient retrieval
5. **Response Generation**: Gemini AI generates contextual responses

### Dependencies

- **Google Generative AI**: Gemini API client
- **Flask**: Web framework
- **Langchain**: RAG framework
- **HuggingFace**: Text embeddings
- **Sentence Transformers**: Embedding models
- **FAISS**: Vector similarity search

## License

This project is part of my portfolio and is intended for demonstration purposes.