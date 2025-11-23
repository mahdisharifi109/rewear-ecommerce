import React, { useState } from 'react';
import { ChatList } from '../features/chat/ChatList';
import { ChatWindow } from '../features/chat/ChatWindow';

export const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<{
    id: string;
    name: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
        
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden min-h-[600px] flex">
          {/* Sidebar */}
          <div className="w-1/3 border-r bg-white flex flex-col">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-700">Conversations</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              <ChatList
                onSelectConversation={(id, name) => setSelectedConversation({ id, name })}
                selectedConversationId={selectedConversation?.id}
              />
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 bg-gray-50 flex items-center justify-center">
            {selectedConversation ? (
              <div className="w-full h-full flex flex-col">
                <ChatWindow
                  conversationId={selectedConversation.id}
                  otherUserName={selectedConversation.name}
                />
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
