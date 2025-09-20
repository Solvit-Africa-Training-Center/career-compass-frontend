import CallApi from '@/utils/callApi';
import { backend_path } from '@/utils/enum';
import type { ChatSession, ChatRequest, ChatResponse } from '@/types';

export class ChatbotService {
  // Create a new chat session
  static async createSession(role: string = 'student'): Promise<ChatSession> {
    try {
      const response = await CallApi.post(backend_path.ADD_SESSION, { role });
      return response.data;
    } catch (error) {
      console.error('Failed to create chat session:', error);
      throw new Error('Failed to create chat session');
    }
  }

  // Send a message to the chatbot
  static async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await CallApi.post(backend_path.CREATE_CHAT, request);
      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw new Error('Failed to send message');
    }
  }

  // Get session history
  static async getSessionHistory(sessionId: string): Promise<any[]> {
    try {
      const response = await CallApi.get(`${backend_path.SESSION_HISTORY}${sessionId}/history/`);
      return response.data || [];
    } catch (error) {
      console.error('Failed to get session history:', error);
      return [];
    }
  }

  // End a chat session
  static async endSession(sessionId: string): Promise<void> {
    try {
      await CallApi.post(`${backend_path.SESSION_END}${sessionId}/end/`);
    } catch (error) {
      console.error('Failed to end session:', error);
      throw new Error('Failed to end session');
    }
  }

  // Get list of sessions
  static async getSessions(): Promise<ChatSession[]> {
    try {
      const response = await CallApi.get(backend_path.LIST_CHAT);
      return response.data || [];
    } catch (error) {
      console.error('Failed to get sessions:', error);
      return [];
    }
  }

  // Get a specific session
  static async getSession(sessionId: string): Promise<ChatSession> {
    try {
      const response = await CallApi.get(`${backend_path.GET_SESSION}${sessionId}/`);
      return response.data;
    } catch (error) {
      console.error('Failed to get session:', error);
      throw new Error('Failed to get session');
    }
  }
}