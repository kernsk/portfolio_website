import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.document_loaders import TextLoader
from langchain.schema import Document
import google.generativeai as genai
from google.generativeai import types
from sentence_transformers import SentenceTransformer
import numpy as np
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class GeminiRAGChatbot:
    def __init__(self):
        self.vectorstore = None
        self.embeddings = None
        self.documents = []
        self.response_cache = {}  # Simple cache for responses
        self.safety_settings = [
            { "category": types.HarmCategory.HARM_CATEGORY_HARASSMENT,
            "threshold": types.HarmBlockThreshold.BLOCK_NONE },
            { "category": types.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            "threshold": types.HarmBlockThreshold.BLOCK_NONE },
            { "category": types.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            "threshold": types.HarmBlockThreshold.BLOCK_NONE },
            { "category": types.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            "threshold": types.HarmBlockThreshold.BLOCK_NONE }
        ]
        self.setup_gemini()
        self.setup_rag_system()
    
    def setup_gemini(self):
        """Initialize Gemini API"""
        try:
            api_key = os.getenv("GOOGLE_API_KEY")
            if not api_key:
                logger.warning("GOOGLE_API_KEY not found in environment variables")
                return
            
            genai.configure(api_key=api_key)

            self.model = genai.GenerativeModel('gemini-2.5-flash-lite', safety_settings=self.safety_settings)
            logger.info("Gemini API initialized successfully with model: gemini-2.5-flash-lite (safety filters disabled)")

        except Exception as e:
            logger.error(f"Error setting up Gemini API: {str(e)}")
            self.model = None
    
    def setup_rag_system(self):
        """Initialize the RAG system with knowledge base"""
        try:
            # Load knowledge base
            knowledge_base = self.load_knowledge_base()
            
            # Create text splitter with smaller chunks for faster processing
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=500,  # Reduced from 1000
                chunk_overlap=100,  # Reduced from 200
                length_function=len
            )
            
            # Split documents
            splits = text_splitter.split_documents(knowledge_base)
            self.documents = splits
            
            # Create embeddings with a smaller, faster model
            self.embeddings = HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2",
                model_kwargs={'device': 'cpu'},
                encode_kwargs={'normalize_embeddings': True}
            )
            
            # Create vector store
            self.vectorstore = FAISS.from_documents(splits, self.embeddings)
            
            logger.info("RAG system initialized successfully")
            
        except Exception as e:
            logger.error(f"Error setting up RAG system: {str(e)}")
            raise
    
    def load_knowledge_base(self):
        """Load knowledge base from file"""
        knowledge_file = "knowledge_base.txt"
        
        if not os.path.exists(knowledge_file):
            # Create default knowledge base about Kevin Kerns
            self.create_default_knowledge_base(knowledge_file)
        
        try:
            loader = TextLoader(knowledge_file)
            documents = loader.load()
            return documents
        except Exception as e:
            logger.error(f"Error loading knowledge base: {str(e)}")
            # Return default document if file loading fails
            return [Document(page_content="I'm Kevin Kerns' portfolio assistant. I can help you learn about Kevin's experience, skills, and projects.", metadata={})]
    
    def create_default_knowledge_base(self, filename):
        """Create default knowledge base"""
        knowledge_content = """
Kevin Kerns - Software Engineer Portfolio Information

About Kevin Kerns:
Kevin Kerns is a passionate software engineer with over 20 years of professional experience and 5 years specialized in computer science. He thrives on solving complex technical challenges and has a strong background in AI/ML, cloud computing, and full-stack development.

Professional Experience:
At Amazon, Kevin developed a groundbreaking hand gesture recognition microservice for Alexa, achieving 76% accuracy and increasing market reach by up to 14.6% globally. This project demonstrates his commitment to creating technology that enhances accessibility and user experience.

Kevin has 10 years of leadership experience in the United States Navy, where he led teams of 45+ personnel and revolutionized maintenance systems, improving operational scores by up to 42%.

Technical Skills:
Programming Languages: Java, Python, C++, C#, JavaScript, Node.js, SQL
Cloud & Platforms: AWS, Amazon Bedrock, Docker, Kubernetes
AI/ML & Computer Vision: MediaPipe, OpenCV, Machine Learning, Generative AI

Featured Projects:
1. Alexa Gesture Recognition: Revolutionary microservice enabling gesture-based interaction with Alexa for users with speech or mobility impairments. Achieved 76% accuracy and increased Amazon's global market reach by 14.6%. Technologies: Java, AWS SDK, MediaPipe, OpenCV, Amazon Bedrock, AI/ML

2. 3D Rock Paper Scissors: Immersive 3D implementation of the classic game featuring gesture-based animation, rigged hand models, and seamless 2D/3D UI integration. Technologies: C++, OpenGL, Blender, 3D Graphics

3. Spotibot: Discord bot with seamless Spotify integration, enabling music playbook in server channels through intuitive slash commands and API integration. Technologies: Node.js, Discord API, Spotify API, HTML/CSS

Contact Information:
Phone: (757) 277-1938
Email: Kevin.Kerns88@gmail.com
LinkedIn: https://www.linkedin.com/in/krkerns
GitHub: https://github.com/kernsk
Location: Seattle, WA
Status: Open to opportunities

Kevin specializes in:
- AI/ML development and implementation
- Cloud computing solutions
- Full-stack web development
- Computer vision and gesture recognition
- Microservices architecture
- Team leadership and project management
"""
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(knowledge_content)
        
        logger.info(f"Created default knowledge base: {filename}")
    
    def retrieve_relevant_docs(self, query, k=2):
        """Retrieve relevant documents for the query"""
        try:
            if not self.vectorstore:
                return []
            
            relevant_docs = self.vectorstore.similarity_search(query, k=k)
            return relevant_docs
            
        except Exception as e:
            logger.error(f"Error retrieving documents: {str(e)}")
            return []
    
    def get_response(self, question):
        """Get response from RAG system using Gemini"""
        try:
            logger.info(f"Processing question: {question}")
            
            if not self.model:
                logger.error("Model is None - API not initialized")
                return "I'm sorry, the AI service is not available right now. Please try again later."
            
            # Check cache first for faster responses
            question_key = question.lower().strip()
            if question_key in self.response_cache:
                logger.info("Returning cached response")
                return self.response_cache[question_key]
            
            logger.info("Retrieving relevant documents...")
            # Retrieve relevant documents (reduced from 3 to 2 for faster processing)
            relevant_docs = self.retrieve_relevant_docs(question, k=2)
            logger.info(f"Retrieved {len(relevant_docs)} documents")
            
            # Prepare context from relevant documents (limit context length)
            context = "\n".join([doc.page_content for doc in relevant_docs])
            logger.info(f"Context length: {len(context)} characters")
            
            # Limit context to 1500 characters to speed up processing
            if len(context) > 1500:
                context = context[:1500] + "..."
                logger.info("Context truncated to 1500 characters")
            
            # Create a professional prompt optimized for Navy/military experience questions
            prompt = f"""
You are a professional career advisor helping to present Kevin Kerns' qualifications and experience. Based on the following verified professional information about Kevin:

{context}

Question: {question}

Please provide a brief response with a professional tone.
Format your response professionally with clear organization. Use bullet points where helpful and emphasize key achievements. Provide a direct, informative answer without preamble.
Limit your response to information directly related to the question. Limit your response to 245 tokens.
"""
            
            logger.info("Sending request to Gemini...")
            # Get response from Gemini with generation config for faster responses
            generation_config = {
                "temperature": 0.7,
                "top_p": 0.8,
                "top_k": 40,
                "max_output_tokens": 300,  # Limit response length for speed
            }
            
            response = self.model.generate_content(
                prompt,
                generation_config=generation_config,
                safety_settings=self.safety_settings
            )
            
            logger.info("Received response from Gemini")
            
            # Check if response has candidates and handle different finish reasons
            if response and response.candidates:
                candidate = response.candidates[0]
                logger.info(f"Response finish reason: {candidate.finish_reason}")
                logger.info(f"Finish reason name: {candidate.finish_reason.name if hasattr(candidate.finish_reason, 'name') else 'Unknown'}")
                logger.info(f"Question was: {question}")
                
                # Check if the response was blocked or had issues
                if candidate.finish_reason == 2:  # SAFETY
                    logger.warning(f"Response blocked by safety filters for question: {question}")
                    return "I'm sorry, I couldn't generate a response due to safety filters. Please try rephrasing your question about Kevin's professional experience."
                elif candidate.finish_reason == 3:  # RECITATION
                    logger.warning("Response blocked due to recitation")
                    return "I'm sorry, I couldn't generate a response due to content policies. Please try rephrasing your question."
                elif candidate.finish_reason == 4:  # OTHER
                    logger.warning("Response blocked for other reasons")
                    return "I'm sorry, I couldn't generate a response at this time. Please try again later."
                
                # Try to access the text safely
                try:
                    if hasattr(candidate, 'content') and candidate.content and candidate.content.parts:
                        response_text = candidate.content.parts[0].text
                        logger.info("Response has text, caching and returning")
                        # Cache the response (limit cache size to prevent memory issues)
                        if len(self.response_cache) < 50:
                            self.response_cache[question_key] = response_text
                        return response_text
                    else:
                        logger.warning("Response has no valid content parts")
                        return "I'm sorry, I couldn't generate a response. Please try rephrasing your question."
                except Exception as text_error:
                    logger.error(f"Error accessing response text: {text_error}")
                    return "I'm sorry, I couldn't generate a response. Please try rephrasing your question."
            else:
                logger.warning("Response is empty or has no candidates")
                return "I'm sorry, I couldn't generate a response. Please try rephrasing your question."
                
        except Exception as e:
            logger.error(f"Error getting response: {str(e)}")
            logger.error(f"Exception type: {type(e).__name__}")
            logger.error(f"Exception details: {repr(e)}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            return "I'm sorry, I encountered an error while processing your question. Please try again."

# Initialize chatbot
chatbot = GeminiRAGChatbot()

@app.route('/')
def index():
    return "Kevin Kerns Portfolio Chatbot API is running!"

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        question = data.get('message', '')
        
        if not question:
            return jsonify({'error': 'No message provided'}), 400
        
        # Get response from chatbot
        response = chatbot.get_response(question)
        
        return jsonify({
            'response': response,
            'status': 'success'
        })
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'status': 'error'
        }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
