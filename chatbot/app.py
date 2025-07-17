import os
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.chains import RetrievalQA
from langchain.llms import GooglePalm
from langchain.document_loaders import TextLoader
from langchain.schema import Document
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

class RAGChatbot:
    def __init__(self):
        self.vectorstore = None
        self.qa_chain = None
        self.setup_rag_system()
    
    def setup_rag_system(self):
        """Initialize the RAG system with knowledge base"""
        try:
            # Load knowledge base
            knowledge_base = self.load_knowledge_base()
            
            # Create text splitter
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                length_function=len
            )
            
            # Split documents
            splits = text_splitter.split_documents(knowledge_base)
            
            # Create embeddings
            embeddings = HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            )
            
            # Create vector store
            self.vectorstore = FAISS.from_documents(splits, embeddings)
            
            # Initialize Gemini (using Google PaLM as placeholder - you'll need to update this)
            # For Gemini, you might need to use google-generativeai library
            # This is a placeholder - update with actual Gemini integration
            llm = GooglePalm(
                google_api_key=os.getenv("GOOGLE_API_KEY"),
                temperature=0.7
            )
            
            # Create retrieval QA chain
            self.qa_chain = RetrievalQA.from_chain_type(
                llm=llm,
                chain_type="stuff",
                retriever=self.vectorstore.as_retriever(search_kwargs={"k": 3}),
                return_source_documents=True
            )
            
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
        """Create default knowledge base about Kevin Kerns"""
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

3. Spotibot: Discord bot with seamless Spotify integration, enabling music playback in server channels through intuitive slash commands and API integration. Technologies: Node.js, Discord API, Spotify API, HTML/CSS

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
    
    def get_response(self, question):
        """Get response from RAG system"""
        try:
            if not self.qa_chain:
                return "I'm sorry, the chatbot system is not available right now. Please try again later."
            
            # Get response from QA chain
            result = self.qa_chain({"query": question})
            
            # Extract answer
            answer = result.get("result", "I'm sorry, I couldn't find an answer to your question.")
            
            return answer
            
        except Exception as e:
            logger.error(f"Error getting response: {str(e)}")
            return "I'm sorry, I encountered an error while processing your question. Please try again."

# Initialize chatbot
chatbot = RAGChatbot()

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
