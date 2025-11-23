import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../auth/store';
import { MessageSquare } from 'lucide-react';

interface Conversation {
  id: string;
  product_id: string;
  product_title: string;
  product_image: string;
  other_user_name: string;
  other_user_avatar: string | null;
}

interface ChatListProps {
  onSelectConversation: (conversationId: string, otherUserName: string) => void;
  selectedConversationId?: string;
  initialConversationId?: string;
}

const API_URL = 'http://localhost:3001';

export const ChatList: React.FC<ChatListProps> = ({ onSelectConversation, selectedConversationId, initialConversationId }) => {
  const { token } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(`${API_URL}/api/conversations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
        }
      } catch (error) {
        console.error('Failed to fetch conversations', error);
      }
    };

    if (token) {
      fetchConversations();
    }
  }, [token]);

  useEffect(() => {
    if (initialConversationId && conversations.length > 0) {
      const conv = conversations.find(c => c.id === initialConversationId);
      if (conv) {
        onSelectConversation(conv.id, conv.other_user_name);
      }
    }
  }, [conversations, initialConversationId]); // Removed onSelectConversation from deps to avoid loop if it's not stable

  if (conversations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <MessageSquare className="mx-auto h-12 w-12 mb-2 opacity-20" />
        <p>No conversations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conv) => (
        <div
          key={conv.id}
          onClick={() => onSelectConversation(conv.id, conv.other_user_name)}
          className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${
            selectedConversationId === conv.id
              ? 'bg-blue-50 border-blue-200 border'
              : 'hover:bg-gray-50 border border-transparent'
          }`}
        >
          <img
            src={conv.product_image || 'https://via.placeholder.com/50'}
            alt={conv.product_title}
            className="w-12 h-12 rounded object-cover bg-gray-200"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">{conv.other_user_name}</h4>
            <p className="text-sm text-gray-500 truncate">{conv.product_title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
