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
    <div className={`flex flex-col h-full max-w-4xl mx-auto rounded-2xl overflow-hidden transition-all duration-300 ${
      isDark ? 'bg-primarycolor-800 shadow-2xl shadow-primarycolor-900/50' : 'bg-neutralcolor-50 shadow-2xl shadow-neutralcolor-300/30'
    }`}>
      {/* Header */}
      <div className={`p-6 flex items-center gap-4 backdrop-blur-sm ${
        isDark ? 'bg-primarycolor-700/90 border-b border-primarycolor-600/50' : 'bg-neutralcolor-50/90 border-b border-neutralcolor-200/50'
      }`}>
        <div className="w-12 h-12 rounded-2xl bg-primarycolor-500 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
          <Bot className="w-7 h-7 text-neutralcolor-50" />
        </div>
        <div className="flex-1">
          <h2 className={`font-bold text-xl tracking-tight ${isDark ? 'text-neutralcolor-50' : 'text-primarycolor-800'}`}>
            Career Compass Assistant
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
            <p className={`text-sm font-medium ${isDark ? 'text-primarycolor-200' : 'text-primarycolor-600'}`}>
              Online • Ready to help {userName}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${
        isDark ? 'bg-primarycolor-800/50' : 'bg-neutralcolor-100/30'
      }`}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-4 animate-fadeIn ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            {message.isBot && (
              <div className="w-10 h-10 rounded-2xl bg-primarycolor-500 flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="w-5 h-5 text-neutralcolor-50" />
              </div>
            )}
            <div
              className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                message.isBot
                  ? isDark
                    ? 'bg-primarycolor-600 text-neutralcolor-50'
                    : 'bg-neutralcolor-50 text-primarycolor-800 border border-primarycolor-200'
                  : 'bg-primarycolor-500 text-neutralcolor-50'
              }`}
            >
              <p className="text-base leading-relaxed">{message.text}</p>
              <p className={`text-xs mt-2 font-medium ${
                message.isBot
                  ? isDark ? 'text-primarycolor-200' : 'text-primarycolor-500'
                  : 'text-primarycolor-100'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {!message.isBot && (
              <div className="w-10 h-10 rounded-2xl bg-secondarycolor-500 flex items-center justify-center flex-shrink-0 shadow-md">
                <User className="w-5 h-5 text-neutralcolor-50" />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-4 justify-start animate-fadeIn">
            <div className="w-10 h-10 rounded-2xl bg-primarycolor-500 flex items-center justify-center flex-shrink-0 shadow-md">
              <Bot className="w-5 h-5 text-neutralcolor-50" />
            </div>
            <div className={`px-5 py-3 rounded-2xl shadow-sm ${
              isDark ? 'bg-primarycolor-600' : 'bg-neutralcolor-50 border border-primarycolor-200'
            }`}>
              <div className="flex space-x-2">
                <div className="w-2.5 h-2.5 bg-primarycolor-400 rounded-full animate-bounce"></div>
                <div className="w-2.5 h-2.5 bg-primarycolor-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2.5 h-2.5 bg-primarycolor-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`p-6 backdrop-blur-sm ${
        isDark ? 'bg-primarycolor-700/90 border-t border-primarycolor-600/50' : 'bg-neutralcolor-50/90 border-t border-neutralcolor-200/50'
      }`}>
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className={`flex-1 px-5 py-3 rounded-2xl border-2 transition-all duration-200 focus:ring-4 focus:ring-primarycolor-500/20 focus:border-primarycolor-500 ${
              isDark 
                ? 'bg-primarycolor-800/50 border-primarycolor-600 text-neutralcolor-50 placeholder-primarycolor-300' 
                : 'bg-neutralcolor-50 border-primarycolor-200 text-primarycolor-800 placeholder-primarycolor-400'
            }`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="px-5 py-3 bg-primarycolor-500 text-neutralcolor-50 rounded-2xl hover:bg-primarycolor-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;