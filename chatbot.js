class PortfolioChatbot {
    constructor() {
        this.isOpen = false;
        this.apiUrl = 'http://localhost:5000'; // Update this to your backend URL
        this.init();
    }

    // Simple markdown parser for basic formatting
    parseMarkdown(text) {
        let processedText = text;
        
        // Process bold text first (**text** and __text__)
        processedText = processedText
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/__([^_]+)__/g, '<strong>$1</strong>');
        
        // Handle bullet points - be very specific about format
        processedText = processedText
            .replace(/^[ \t]*\*[ \t]+(.+)$/gm, '<li>$1</li>')
            .replace(/^[ \t]*-[ \t]+(.+)$/gm, '<li>$1</li>')
            .replace(/^[ \t]*•[ \t]+(.+)$/gm, '<li>$1</li>')
            .replace(/^[ \t]*\d+\.[ \t]+(.+)$/gm, '<li>$1</li>');
        
        // Wrap list items in ul tags
        processedText = processedText.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
        processedText = processedText.replace(/<\/ul>\s*<ul>/g, '');
        
        // Handle line breaks
        processedText = processedText.replace(/\n/g, '<br>');
        
        return processedText;
    }

    init() {
        this.createChatbotElements();
        this.setupEventListeners();
    }

    createChatbotElements() {
        // Create chatbot bubble
        const chatbotBubble = document.createElement('div');
        chatbotBubble.id = 'chatbot-bubble';
        chatbotBubble.className = 'chatbot-bubble';
        chatbotBubble.innerHTML = `
            <div class="chatbot-speech-bubble"></div>
            <div class="chatbot-robot">
                <i class="fas fa-robot"></i>
            </div>
        `;

        // Create chatbot window
        const chatbotWindow = document.createElement('div');
        chatbotWindow.id = 'chatbot-window';
        chatbotWindow.className = 'chatbot-window';
        chatbotWindow.innerHTML = `
            <div class="chatbot-header">
                <div class="chatbot-title">
                    <i class="fas fa-robot"></i>
                    <span>Kevin's AI Assistant</span>
                </div>
                <button class="chatbot-close" id="chatbot-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="chatbot-messages" id="chatbot-messages">
                <div class="chatbot-message bot-message">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <p>Hi! I'm Kevin's AI assistant. I can help you learn about his experience, skills, and projects. What would you like to know?</p>
                    </div>
                </div>
            </div>
            <div class="chatbot-input-container">
                <input type="text" id="chatbot-input" placeholder="Ask me about Kevin's work..." />
                <button id="chatbot-send">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        `;

        // Add to document
        document.body.appendChild(chatbotBubble);
        document.body.appendChild(chatbotWindow);
    }

    setupEventListeners() {
        const bubble = document.getElementById('chatbot-bubble');
        const closeBtn = document.getElementById('chatbot-close');
        const input = document.getElementById('chatbot-input');
        const sendBtn = document.getElementById('chatbot-send');

        bubble.addEventListener('click', () => this.toggleChatbot());
        closeBtn.addEventListener('click', () => this.closeChatbot());
        sendBtn.addEventListener('click', () => this.sendMessage());
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Add wave animation
        setInterval(() => {
            if (!this.isOpen) {
                bubble.classList.add('wave');
                setTimeout(() => bubble.classList.remove('wave'), 1000);
            }
        }, 5000);
    }

    toggleChatbot() {
        if (this.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }

    openChatbot() {
        const window = document.getElementById('chatbot-window');
        const bubble = document.getElementById('chatbot-bubble');
        
        window.classList.add('open');
        bubble.classList.add('hidden');
        this.isOpen = true;

        // Focus input
        setTimeout(() => {
            document.getElementById('chatbot-input').focus();
        }, 300);
    }

    closeChatbot() {
        const window = document.getElementById('chatbot-window');
        const bubble = document.getElementById('chatbot-bubble');
        
        window.classList.remove('open');
        bubble.classList.remove('hidden');
        this.isOpen = false;
    }

    async sendMessage() {
        const input = document.getElementById('chatbot-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Clear input
        input.value = '';

        // Add user message
        this.addMessage(message, 'user');

        // Show typing indicator
        this.showTyping();

        try {
            // Send to backend
            const response = await fetch(`${this.apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();
            
            // Hide typing indicator
            this.hideTyping();

            if (data.status === 'success') {
                this.addMessage(data.response, 'bot');
            } else {
                this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
            }

        } catch (error) {
            console.error('Error sending message:', error);
            this.hideTyping();
            this.addMessage('Sorry, I\'m having trouble connecting right now. Please try again later.', 'bot');
        }
    }

    addMessage(content, type) {
        const messagesContainer = document.getElementById('chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${type}-message`;
        
        if (type === 'user') {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${content}</p>
                </div>
                <div class="message-avatar">
                    <i class="fas fa-user"></i>
                </div>
            `;
        } else {
            const parsedContent = this.parseMarkdown(content);
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div>${parsedContent}</div>
                </div>
            `;
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTyping() {
        // Remove any existing typing indicator first
        this.hideTyping();
        
        const messagesContainer = document.getElementById('chatbot-messages');
        
        // Create typing indicator element
        const typingDiv = document.createElement('div');
        typingDiv.id = 'chatbot-typing';
        typingDiv.className = 'chatbot-typing';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <span class="typing-text"></span>
            </div>
        `;
        
        // Add to messages container
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        const typing = document.getElementById('chatbot-typing');
        if (typing) {
            typing.remove();
        }
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioChatbot();
});
