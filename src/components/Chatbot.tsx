import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const { isDark } = useTheme();
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userName = profile?.first_name || 'Student';

  useEffect(() => {
    // Welcome message on startup
    const welcomeMessage: Message = {
      id: '1',
      text: `Hello ${userName}! 👋 I'm your Career Compass assistant. I'm here to help you with program recommendations, application guidance, and career advice. How can I assist you today?`,
      isBot: true,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [userName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(input),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('program') || input.includes('course')) {
      return `Great question, ${userName}! I can help you find programs that match your interests. What field are you interested in studying?`;
    }
    if (input.includes('application') || input.includes('apply')) {
      return `I'd be happy to guide you through the application process! What specific aspect would you like help with - requirements, deadlines, or documents?`;
    }
    if (input.includes('career') || input.includes('job')) {
      return `Career planning is important! Based on your profile, I can suggest career paths and relevant programs. What career interests you most?`;
    }
    if (input.includes('hello') || input.includes('hi')) {
      return `Hello again, ${userName}! How can I help you with your educational journey today?`;
    }
    
    return `Thanks for your question, ${userName}! I'm here to help with program recommendations, applications, and career guidance. Could you be more specific about what you'd like to know?`;
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className={`p-4 border-b flex items-center gap-3 ${
        isDark ? 'bg-primarycolor-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="w-10 h-10 rounded-full bg-primarycolor-500 flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Career Compass Assistant
          </h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Online • Ready to help {userName}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${
        isDark ? 'bg-primarycolor-800' : 'bg-gray-50'
      }`}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            {message.isBot && (
              <div className="w-8 h-8 rounded-full bg-primarycolor-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.isBot
                  ? isDark
                    ? 'bg-primarycolor-700 text-white'
                    : 'bg-white text-gray-900 border'
                  : 'bg-primarycolor-500 text-white'
              }`}
            >
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.isBot
                  ? isDark ? 'text-gray-400' : 'text-gray-500'
                  : 'text-primarycolor-100'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {!message.isBot && (
              <div className="w-8 h-8 rounded-full bg-secondarycolor-500 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-primarycolor-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className={`px-4 py-2 rounded-lg ${
              isDark ? 'bg-primarycolor-700' : 'bg-white border'
            }`}>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primarycolor-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primarycolor-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primarycolor-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`p-4 border-t ${
        isDark ? 'bg-primarycolor-900 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className={`flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primarycolor-500 focus:border-transparent ${
              isDark 
                ? 'bg-primarycolor-800 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-4 py-2 bg-primarycolor-500 text-white rounded-lg hover:bg-primarycolor-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;