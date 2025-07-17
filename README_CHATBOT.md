# Kevin Kerns Portfolio Chatbot

This is an AI-powered RAG (Retrieval-Augmented Generation) chatbot integrated into Kevin Kerns' portfolio website. The chatbot uses Google's Gemini AI model and Langchain to provide intelligent responses about Kevin's experience, skills, and projects.

## Features

- **RAG Architecture**: Retrieves relevant information from a knowledge base before generating responses
- **Gemini AI Integration**: Uses Google's free Gemini Pro model for natural language generation
- **Modern UI**: Clean, responsive chat interface that matches the portfolio's design
- **Real-time Chat**: Instant responses with typing indicators
- **Professional Context**: Focused on Kevin's professional background and portfolio

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- Google API key (free from Google AI Studio)

### Installation

1. **Run the setup script**:
   ```bash
   # On Windows
   setup_chatbot.bat
   
   # On macOS/Linux
   chmod +x setup_chatbot.sh
   ./setup_chatbot.sh
   ```

2. **Get your Google API key**:
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key (free tier available)
   - Copy the API key

3. **Configure environment variables**:
   ```bash
   # Copy the example environment file
   cp chatbot/.env.example chatbot/.env
   
   # Edit the .env file and add your API key
   GOOGLE_API_KEY=your_actual_api_key_here
   ```

### Running the Chatbot

1. **Start the backend server**:
   ```bash
   # Activate virtual environment
   source chatbot_env/bin/activate  # On Windows: chatbot_env\Scripts\activate
   
   # Run the chatbot server
   python chatbot/gemini_chatbot.py
   ```

2. **Open your portfolio website**:
   - Open `index.html` in your browser
   - The chatbot bubble should appear in the bottom right corner
   - Click the bubble to start chatting!

## File Structure

```
portfolio_website/
├── chatbot/
│   ├── app.py                 # Original Flask app (Langchain version)
│   ├── gemini_chatbot.py     # Main chatbot server (Gemini version)
│   ├── requirements.txt      # Python dependencies
│   ├── .env.example         # Environment variables template
│   └── knowledge_base.txt   # Auto-generated knowledge base
├── chatbot.js               # Frontend JavaScript
├── chatbot.css             # Chatbot styling
├── setup_chatbot.bat       # Windows setup script
├── setup_chatbot.sh        # Unix setup script
└── README.md               # This file
```

## Customization

### Updating the Knowledge Base

The chatbot automatically creates a knowledge base from Kevin's portfolio information. To update it:

1. Edit `chatbot/knowledge_base.txt` or
2. Modify the `create_default_knowledge_base()` function in `gemini_chatbot.py`

### Styling

The chatbot UI can be customized by editing `chatbot.css`. The design uses the same CSS variables as the main portfolio for consistency.

### Backend Configuration

- **API URL**: Update the `apiUrl` in `chatbot.js` if hosting the backend elsewhere
- **Model Settings**: Modify the Gemini model configuration in `gemini_chatbot.py`
- **Response Behavior**: Adjust the prompt template in the `get_response()` method

## Technical Details

### RAG Implementation

1. **Document Loading**: Loads knowledge base from text file
2. **Text Splitting**: Chunks text into manageable pieces
3. **Embedding Creation**: Uses HuggingFace embeddings for similarity search
4. **Vector Storage**: FAISS vector database for efficient retrieval
5. **Response Generation**: Gemini AI generates contextual responses

### API Endpoints

- `GET /`: Health check
- `POST /chat`: Send message and receive response
- `GET /health`: Service health status

### Dependencies

- **Flask**: Web framework
- **Langchain**: RAG framework
- **Google Generative AI**: Gemini API client
- **FAISS**: Vector similarity search
- **HuggingFace**: Text embeddings
- **Sentence Transformers**: Embedding models

## Troubleshooting

### Common Issues

1. **API Key Issues**:
   - Ensure your API key is valid and added to `.env`
   - Check that the API key has proper permissions

2. **CORS Errors**:
   - Make sure the backend is running on the correct port (5000)
   - Check that CORS is properly configured in the Flask app

3. **Dependencies**:
   - Ensure all requirements are installed: `pip install -r chatbot/requirements.txt`
   - Try using a virtual environment to avoid conflicts

4. **Performance**:
   - The first response may be slow due to model loading
   - Consider using a more powerful embedding model for better results

### Development Mode

To run in development mode with auto-reload:
```bash
python chatbot/gemini_chatbot.py
```

The server will automatically restart when you make changes to the code.

## Production Deployment

For production deployment:

1. **Update API URL**: Change `apiUrl` in `chatbot.js` to your production server
2. **Environment Variables**: Use proper environment variable management
3. **Security**: Implement rate limiting and input validation
4. **Monitoring**: Add logging and error tracking
5. **Scaling**: Consider using gunicorn or similar WSGI server

## License

This project is part of Kevin Kerns' portfolio and is intended for demonstration purposes.
