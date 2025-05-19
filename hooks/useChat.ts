import { useState, useEffect } from 'react';
import { Chat, ChatMessage, User } from '../types';

interface ChatState {
  chats: Chat[];
  isLoading: boolean;
}

// Mock data for demonstration purposes
const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    participants: ['1', '2'],
    messages: [
      {
        id: '1',
        senderId: '2',
        receiverId: '1',
        content: 'Hello! Would you like to grab a coffee?',
        timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
        read: true,
      },
      {
        id: '2',
        senderId: '1',
        receiverId: '2',
        content: 'Sure! When and where?',
        timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
        read: true,
      },
      {
        id: '3',
        senderId: '2',
        receiverId: '1',
        content: 'How about Cafe Milano at 3pm?',
        timestamp: Date.now() - 1000 * 60 * 20, // 20 minutes ago
        read: false,
      },
    ],
    unreadCount: 1,
  },
];

export function useChat(currentUserId: string) {
  const [chatState, setChatState] = useState<ChatState>({
    chats: [],
    isLoading: true,
  });

  // Initialize chat state
  useEffect(() => {
    const fetchChats = async () => {
      try {
        // Simulate API call to get chats
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, we'll use mock data
        setChatState({
          chats: MOCK_CHATS,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error fetching chats:', error);
        setChatState(prev => ({ ...prev, isLoading: false }));
      }
    };

    if (currentUserId) {
      fetchChats();
    } else {
      setChatState({
        chats: [],
        isLoading: false,
      });
    }
  }, [currentUserId]);

  // Get chat by ID
  const getChatById = (chatId: string) => {
    return chatState.chats.find(chat => chat.id === chatId);
  };

  // Get chat by participant
  const getChatByParticipant = (participantId: string) => {
    return chatState.chats.find(chat => 
      chat.participants.includes(participantId) && 
      chat.participants.includes(currentUserId)
    );
  };

  // Create a new chat or get existing one
  const getOrCreateChat = async (otherUserId: string) => {
    try {
      // Check if chat already exists
      const existingChat = getChatByParticipant(otherUserId);
      
      if (existingChat) {
        return { success: true, chatId: existingChat.id };
      }
      
      // Create a new chat
      const newChat: Chat = {
        id: `chat_${Date.now()}`,
        participants: [currentUserId, otherUserId],
        messages: [],
        unreadCount: 0,
      };
      
      setChatState(prev => ({
        ...prev,
        chats: [...prev.chats, newChat],
      }));
      
      return { success: true, chatId: newChat.id };
    } catch (error) {
      console.error('Error creating chat:', error);
      return { success: false, error: 'Failed to create chat' };
    }
  };

  // Send a message
  const sendMessage = async (receiverId: string, content: string) => {
    try {
      // Get or create chat
      const { success, chatId, error } = await getOrCreateChat(receiverId);
      
      if (!success || !chatId) {
        return { success: false, error };
      }
      
      // Create new message
      const newMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        senderId: currentUserId,
        receiverId,
        content,
        timestamp: Date.now(),
        read: false,
      };
      
      // Update chat with new message
      setChatState(prev => ({
        ...prev,
        chats: prev.chats.map(chat => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: newMessage,
            };
          }
          return chat;
        }),
      }));
      
      return { success: true, messageId: newMessage.id };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error: 'Failed to send message' };
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (chatId: string) => {
    try {
      setChatState(prev => ({
        ...prev,
        chats: prev.chats.map(chat => {
          if (chat.id === chatId) {
            return {
              ...chat,
              messages: chat.messages.map(message => {
                if (message.receiverId === currentUserId && !message.read) {
                  return { ...message, read: true };
                }
                return message;
              }),
              unreadCount: 0,
            };
          }
          return chat;
        }),
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error marking messages as read:', error);
      return { success: false, error: 'Failed to mark messages as read' };
    }
  };

  // Get total unread messages count
  const getTotalUnreadCount = () => {
    return chatState.chats.reduce((total, chat) => total + chat.unreadCount, 0);
  };

  return {
    ...chatState,
    getChatById,
    getChatByParticipant,
    getOrCreateChat,
    sendMessage,
    markMessagesAsRead,
    getTotalUnreadCount,
  };
}