import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Maximize2, Minimize2 } from 'lucide-react';
import ConnectionError from './ConnectionError';
import PropTypes from 'prop-types';

const PortfolioAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [typingComplete, setTypingComplete] = useState({});

  const messagesEndRef = useRef(null);
  const chatContentRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Assistant URL from environment variables
  const ASSISTANT_URL = import.meta.env.VITE_ASSISTANT_API_URL || 'https://portfolioasistant-0081e8bd2f7d.herokuapp.com/api/portfolio-chat';

  // Initial setup
  useEffect(() => {
    const openingMessage = {
      text: "👋 Hi there! I'm jaqbek's portfolio assistant. I can tell you about their skills, projects, and services. How can I help you today?",
      role: 'assistant',
      timestamp: new Date().toISOString(),
      id: 'intro-message'
    };
    setMessages([openingMessage]);
    setTypingComplete({ 'intro-message': true });
  }, []);

  const scrollToBottom = () => {
    if (chatContentRef.current) chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    const timeoutId = setTimeout(() => scrollToBottom(), 100);
    return () => clearTimeout(timeoutId);
  }, [messages, typingComplete]);

  useEffect(() => {
    if (isChatOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isChatOpen]);

  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    const messageId = `msg-${Date.now()}`;
    const userMessage = {
      text: trimmedInput,
      role: 'user',
      timestamp: new Date().toISOString(),
      id: `user-${messageId}`
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);
    setTypingComplete(prev => ({ ...prev, [`user-${messageId}`]: true }));

    try {
      const history = messages.map(msg => ({ role: msg.role, text: msg.text }));
      const response = await fetch(ASSISTANT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text, history }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      const botMessage = {
        text: data.response,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        id: `assistant-${messageId}`
      };

      setMessages(prev => [...prev, botMessage]);
      setTypingComplete(prev => ({ ...prev, [`assistant-${messageId}`]: false }));
    } catch (err) {
      console.error('Error sending message:', err);
      if (err.name !== 'AbortError') {
        // Create fallback response if we can't reach the server
        const fallbackMessage = {
          text: "I'm having trouble connecting to my knowledge base right now. Please check your internet connection and try again in a moment. If this problem persists, you can always contact the developer directly.",
          role: 'assistant',
          timestamp: new Date().toISOString(),
          id: `assistant-fallback-${messageId}`
        };
        
        setMessages(prev => [...prev, fallbackMessage]);
        setTypingComplete(prev => ({ ...prev, [`assistant-fallback-${messageId}`]: false }));
        setError('Connection error. Displaying fallback response.');
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleCancelRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      setError('Request canceled. How can I help you?');
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleTypingComplete = (messageId) => {
    setTypingComplete(prev => ({ ...prev, [messageId]: true }));
    setTimeout(scrollToBottom, 100);
  };

  const formatText = (text, messageId, isTyping) => {
    if (!text) return '';
    
    // For user messages or completed bot messages, render normally
    if (!isTyping) {
      return text.split('```').map((segment, index) => {
        if (index % 2 === 1) {
          const codeLines = segment.split('\n');
          const language = codeLines[0].trim();
          const code = codeLines.slice(1).join('\n');
          return <pre key={index} className="bg-black bg-opacity-50 p-2 rounded overflow-auto text-xs"><code className={language ? `language-${language}` : ''}>{code}</code></pre>;
        } else {
          return <div key={index}>{segment.split('`').map((part, idx) => 
            idx % 2 === 1 ? <code key={idx} className="bg-black bg-opacity-30 px-1 rounded text-xs">{part}</code> : <span key={idx}>{part}</span>
          )}</div>;
        }
      });
    }
    
    // For bot messages that need typing animation
    return (
      <TypedText 
        text={text} 
        wordsPerChunk={Math.floor(Math.random() * 4) + 2} // Random 2-5 words per chunk
        typingSpeed={40} 
        onComplete={() => handleTypingComplete(messageId)}
      />
    );
  };

  // TypedText component embedded for simplicity
  const TypedText = ({ text, typingSpeed = 40, wordsPerChunk = 3, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
      setDisplayedText('');
      setIsComplete(false);
      
      if (!text) return;
      
      const words = text.split(' ');
      const chunks = [];
      
      for (let i = 0; i < words.length; i += wordsPerChunk) {
        const actualChunkSize = typeof wordsPerChunk === 'number' 
          ? wordsPerChunk 
          : Math.floor(Math.random() * 4) + 2;
        
        chunks.push(words.slice(i, i + actualChunkSize).join(' '));
      }
      
      let currentIndex = 0;
      const totalChunks = chunks.length;
      
      const calculatedDelay = Math.min(5000 / totalChunks, typingSpeed);

      const typingInterval = setInterval(() => {
        if (currentIndex < totalChunks) {
          setDisplayedText(prev => {
            const newText = prev ? prev + ' ' + chunks[currentIndex] : chunks[currentIndex];
            return newText.trim();
          });
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsComplete(true);
          if (onComplete) onComplete();
        }
      }, calculatedDelay);

      return () => clearInterval(typingInterval);
    }, [text, typingSpeed, wordsPerChunk, onComplete]);

    return (
      <div className="typed-text">
        {displayedText}
        {!isComplete && <span className="cursor">|</span>}
      </div>
    );
  };
  
  // Add prop-types for TypedText component
  TypedText.propTypes = {
    text: PropTypes.string.isRequired,
    typingSpeed: PropTypes.number,
    wordsPerChunk: PropTypes.number,
    onComplete: PropTypes.func
  };

  const chatContainerClass = `fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out
    ${isChatOpen ? (isFullScreen ? 'w-[85vw] h-[85vh] bottom-16 right-16' : 'w-80 h-[28rem]') : 'w-auto h-auto'}`;

  return (
    <div className={chatContainerClass}>
      {!isChatOpen ? (
        <button 
          onClick={toggleChat}
          className="bg-green-500 hover:bg-green-400 text-black font-bold py-3 px-5 rounded-full shadow-lg flex items-center space-x-2 transition-all duration-300 hover:scale-105"
          aria-label="Open chat assistant"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="matrix-header">Ask Portfolio Assistant</span>
        </button>
      ) : (
        <div className="flex flex-col h-full bg-black border border-green-500 rounded-lg shadow-2xl overflow-hidden">
          <div className="flex justify-between items-center p-3 bg-black border-b border-green-500">
            <h3 className="text-green-500 font-bold matrix-header">Portfolio Assistant</h3>
            <div className="flex space-x-2">
              <button onClick={toggleFullScreen} className="text-green-500 hover:text-green-400 transition-colors">
                {isFullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>
              <button onClick={toggleChat} className="text-green-500 hover:text-green-400 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div ref={chatContentRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-black bg-opacity-90">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`max-w-[85%] rounded-lg px-4 py-2 ${
                  message.role === 'user' ? 
                  'ml-auto bg-green-500 text-black' : 
                  'mr-auto bg-black border border-green-500 text-green-400'
                }`}
              >
                <div>
                  {formatText(
                    message.text, 
                    message.id, 
                    message.role === 'assistant' && !typingComplete[message.id]
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="mr-auto bg-black border border-green-500 text-green-400 max-w-[85%] rounded-lg px-4 py-2">
                <div className="flex items-center">
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                  <button onClick={handleCancelRequest} className="ml-4 text-xs text-green-400 hover:text-green-300">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mx-auto max-w-[90%]">
                <ConnectionError 
                  errorMessage={error}
                  onRetry={() => {
                    setError(null);
                    if (messages.length > 0) {
                      const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
                      if (lastUserMessage) {
                        setInputValue(lastUserMessage.text);
                      }
                    }
                  }} 
                />
              </div>
            )}
            
            <div ref={messagesEndRef}></div>
          </div>
          
          <form onSubmit={handleSubmit} className="p-3 border-t border-green-500 bg-black">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Ask about my skills, projects, or services..."
                className="flex-1 px-4 py-2 bg-black text-green-400 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                ref={inputRef}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-green-500 text-black rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !inputValue.trim()}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .cursor {
          display: inline-block;
          width: 2px;
          height: 1em;
          background-color: #22c55e;
          animation: blink 0.8s infinite;
          margin-left: 2px;
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
};

export default PortfolioAssistant;