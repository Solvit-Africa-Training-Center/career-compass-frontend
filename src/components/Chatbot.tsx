import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import CallApi from '@/utils/callApi';
import { backend_path } from '@/utils/enum';
import type { ChatMessage, ChatSession, ChatRequest } from '@/types';

// Define proper error type for axios errors
interface AxiosError {
  response?: {
    status: number;
    statusText: string;
    data: Record<string, unknown>;
  };
  config: Record<string, unknown>;
  message: string;
}

const Chatbot: React.FC = () => {
  const { isDark } = useTheme();
  const { profile, authUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userName = profile?.first_name || 'Student';

  // Create a new chat session
  const createSession = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Debug: Log the request data
      const requestData = {
        role: 'student',
        user_id: authUser?.id
      };
      
      // console.log('Creating session with data:', requestData);
      // console.log('API endpoint:', backend_path.ADD_SESSION);
      // console.log('Full URL:', `${CallApi.defaults.baseURL}${backend_path.ADD_SESSION}`);
      
      const response = await CallApi.post(backend_path.ADD_SESSION, requestData);
      
      // console.log('Session creation response:', response.data);
      
      if (response.data) {
        setCurrentSession(response.data);
        
        // Add welcome message
        const welcomeMessage: ChatMessage = {
          id: '1',
          text: `Hello ${userName}! I'm your Career Compass assistant. I'm here to help you with program recommendations, application guidance, and career advice. How can I assist you today?`,
          isBot: true,
          timestamp: new Date(),
          session_id: response.data.id
        };
        setMessages([welcomeMessage]);
      }
    } catch (err: unknown) {
      console.error('Failed to create chat session:', err);
      
      // Log detailed error information
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as AxiosError;
        console.error('Error details:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          config: axiosError.config
        });
        
        // Provide more specific error messages
        if (axiosError.response?.status === 400) {
          console.error('400 Bad Request - Check request format:', axiosError.response.data);
          setError('Invalid request format. Please check the console for details.');
        } else if (axiosError.response?.status === 401) {
          setError('Authentication required. Please log in again.');
        } else if (axiosError.response?.status === 403) {
          setError('Access denied. You may not have permission to create chat sessions.');
        } else if (axiosError.response?.status === 404) {
          setError('Chat service not found. Please contact support.');
        } else {
          setError(`Server error (${axiosError.response?.status}). Please try again.`);
        }
      } else {
        setError('Network error. Please check your connection and try again.');
      }
      
      toast.error('Failed to start chat session');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize session on component mount
  useEffect(() => {
    if (authUser) {
      createSession();
    }
  }, [authUser, userName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to backend
  const sendMessage = async (messageText: string) => {
    if (!currentSession) {
      toast.error('No active chat session');
      return;
    }

    try {
      const chatRequest: ChatRequest = {
        session_id: currentSession.id,
        message: messageText,
        context: {
          role: 'student',
          user_name: userName,
          profile: profile
        }
      };

      // console.log('Sending message:', chatRequest);
      // console.log('API endpoint:', backend_path.CREATE_CHAT);
      // console.log('Full URL:', `${CallApi.defaults.baseURL}${backend_path.CREATE_CHAT}`);

      const response = await CallApi.post(backend_path.CREATE_CHAT, chatRequest);
      
      // console.log('Message response:', response.data);
      
      if (response.data) {
        // Extract the message text from the response
        // The backend returns: {reply: "...", actions: [], follow_up_questions: []}
        const messageText = response.data.reply || response.data.message || response.data.response || 'No response received';
        
        const botResponse: ChatMessage = {
          id: `bot-${Date.now()}`,
          text: messageText,
          isBot: true,
          timestamp: new Date(),
          session_id: currentSession.id
        };
        setMessages(prev => [...prev, botResponse]);
      }
    } catch (err: unknown) {
      console.error('Failed to send message:', err);
      
      // Log detailed error information
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as AxiosError;
        console.error('Message error details:', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          config: axiosError.config
        });
      }
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        text: 'Sorry, I encountered an error processing your message. Please try again.',
        isBot: true,
        timestamp: new Date(),
        session_id: currentSession?.id || ''
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to send message');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !currentSession || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: input,
      isBot: false,
      timestamp: new Date(),
      session_id: currentSession.id
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = input;
    setInput('');
    setIsTyping(true);

    try {
      await sendMessage(messageText);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // End session and refresh the chatbot
  const endSession = async () => {
    if (!currentSession) return;

    try {
      // Try to end the session on the backend
      await CallApi.post(`${backend_path.SESSION_END}${currentSession.id}/end/`);
    } catch (err: unknown) {
      console.error('Failed to end session on backend:', err);
      // Continue with local cleanup even if backend call fails
    }

    // Reset all state to initial values (refresh the component)
    setCurrentSession(null);
    setMessages([]);
    setInput('');
    setIsTyping(false);
    setError(null);
    setIsLoading(true);

    // Show success message
    toast.success('Chat session ended. Starting new session...');

    // Create a new session after a short delay
    setTimeout(() => {
      if (authUser) {
        createSession();
      }
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col h-full max-w-4xl mx-auto rounded-2xl overflow-hidden transition-all duration-300 ${
        isDark ? 'bg-primarycolor-800 shadow-2xl shadow-primarycolor-900/50' : 'bg-neutralcolor-50 shadow-2xl shadow-neutralcolor-300/30'
      }`}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primarycolor-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Bot className="w-8 h-8 text-neutralcolor-50" />
            </div>
            <p className={`text-lg font-medium ${isDark ? 'text-neutralcolor-50' : 'text-primarycolor-800'}`}>
              Initializing your Career Compass assistant...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !currentSession) {
    return (
      <div className={`flex flex-col h-full max-w-4xl mx-auto rounded-2xl overflow-hidden transition-all duration-300 ${
        isDark ? 'bg-primarycolor-800 shadow-2xl shadow-primarycolor-900/50' : 'bg-neutralcolor-50 shadow-2xl shadow-neutralcolor-300/30'
      }`}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-neutralcolor-50" />
            </div>
            <p className={`text-lg font-medium mb-4 ${isDark ? 'text-neutralcolor-50' : 'text-primarycolor-800'}`}>
              {error}
            </p>
            <div className="space-y-2">
              <button
                onClick={createSession}
                className="px-6 py-3 bg-primarycolor-500 text-neutralcolor-50 rounded-xl hover:bg-primarycolor-600 transition-colors duration-200 mr-2"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  console.log('Current auth state:', { authUser, profile });
                  console.log('Local storage token:', localStorage.getItem('accessToken'));
                }}
                className="px-6 py-3 bg-gray-500 text-neutralcolor-50 rounded-xl hover:bg-gray-600 transition-colors duration-200"
              >
                Debug Info
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <div className={`w-2 h-2 rounded-full ${currentSession ? 'bg-success animate-pulse' : 'bg-gray-400'}`}></div>
            <p className={`text-sm font-medium ${isDark ? 'text-primarycolor-200' : 'text-primarycolor-600'}`}>
              {currentSession ? `Online • Ready to help ${userName}` : 'Connecting...'}
            </p>
          </div>
        </div>
        {currentSession && (
          <button
            onClick={endSession}
            className="px-4 py-2 text-sm bg-red-500 text-neutralcolor-50 rounded-xl hover:bg-red-600 transition-colors duration-200"
          >
            End Session
          </button>
        )}
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
              <p className="text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
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
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            rows={1}
            className={`flex-1 px-5 py-3 rounded-2xl border-2 transition-all duration-200 focus:ring-4 focus:ring-primarycolor-500/20 focus:border-primarycolor-500 resize-none ${
              isDark 
                ? 'bg-primarycolor-800/50 border-primarycolor-600 text-neutralcolor-50 placeholder-primarycolor-300' 
                : 'bg-neutralcolor-50 border-primarycolor-200 text-primarycolor-800 placeholder-primarycolor-400'
            }`}
            disabled={!currentSession || isTyping}
            style={{ minHeight: '52px', maxHeight: '120px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !currentSession || isTyping}
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