import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '../component/types';
import Sidebar from '../component/Sidebar';
import ChatBubble from '../component/ChatBubble';
import { ReactFlowProvider } from 'reactflow';
import useFetchConversation from '../hooks/useFetchConversation';
import useCreateMessage from '../hooks/useCreateMessage';
import useCreateConversation from '../hooks/useCreateConversation';
import useFetchGenai from '../hooks/useFetchGenai';
import axios from 'axios';

interface Conversation {
    id: string;
    titre: string;
    messages: ChatMessage[];
  }
  
  const Chat: React.FC = () => {
    const token = localStorage.getItem('token');
    const [conversations, setConversations] = useState<Conversation[]>([
      {
        id: '1',
        titre: 'New Chat #1',
        messages: [
          {
            id: Date.now(),
            role: 'bot',
            type: 'text',
            text: 'Bonjour ! Décris-moi ton modèle pour générer un MCD.',
          },
        ],
      },
    ]);

    const {fetchConversation, data} = useFetchConversation();
    const {createMessage} = useCreateMessage();
    const {createConversation} = useCreateConversation();
    const {fetchGenai} = useFetchGenai();
    useEffect(() => {
      console.log("miverina")
        if(data) {
            setConversations(data.map((conv: any) => ({
                id: conv.id,
                titre: conv.titre,
                messages: conv.messages.map((msg: any) => ({
                    id: msg.id,
                    role: msg.sender,
                    type: msg.type,
                    text: msg.text,
                    nodes: msg.nodes || msg.type == "mcd" ? JSON.parse(msg.text)?.nodes.map((node: any)=>({
                        id: node.id,
                        data: {
                            label: (<div dangerouslySetInnerHTML={{ __html: node.data.label }} />),
                        },
                        position: node.position,
                        style: node.style,
                    })) : [] ,
                    edges: msg.edges || msg.type == "mcd" ? JSON.parse(msg.text)?.edges : [],
                    loading: false,
                })),
            })));
        }else{
            fetchConversation()
        }
    }, [data]);
    
  
    const [selectedConvId, setSelectedConvId] = useState<string>('1');
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
  
    const selectedConv = conversations.find((c) => c.id === selectedConvId);
  
    const setMessagesForSelectedConv = (messages: ChatMessage[]) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConvId ? { ...conv, messages } : conv
        )
      );
    };
  
    const handleNewConversation = () => {
      const newId = uuidv4() ;
      const newConv: Conversation = {
        id: newId,
        titre: `New Chat`,
        messages: [
          {
            id: Date.now(),
            role: 'bot',
            type: 'text',
            text: 'Bonjour ! Décris-moi ton modèle pour générer un MCD.',
          },
        ],
      };
      setConversations((prev) => [newConv, ...prev]);
      setSelectedConvId(newId);
    };
  
    const handleSelectConversation = (id: string) => {
      setSelectedConvId(id);
    };
  
    const handleSubmit = async(e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || !selectedConv) return;
  
      const userMessage: ChatMessage = {
        id: Date.now(),
        role: 'user',
        type: 'text',
        text: input,
      };
      const updatedMessages = [...selectedConv.messages, userMessage];

      if(Number.isInteger(selectedConvId)) {
          createMessage({
            text: input,
            sender : "user",
            conversation : parseInt(selectedConvId)
          }, parseInt(selectedConvId))
          console.log("ici")
          fetchGenai({
            "message" : input,
            "conversation" : selectedConvId,
          }, setMessagesForSelectedConv, updatedMessages, setIsTyping)
      }else{
        try {
          const response = await axios.post(
            'http://localhost:8000/api/conversations/',
            {
              titre: input.substring(0, 20),
              text:input ,
            },
            {
              headers: {
                'Authorization': `Token ${token?.trim()}`,
                'Content-Type': 'application/json',
              },
            }
          );
          // Create a message for the new conversation
          const messageData = {
            text: input,
            sender: 'user',
            conversation: response.data.id,
          };
          setSelectedConvId(response.data.id);
          createMessage(messageData, response.data.id)
          fetchGenai({
            "message" : input,
            "conversation" : response.data.id,
          }, setMessagesForSelectedConv, updatedMessages, setIsTyping)
        } catch (err: any) {
        }
      }
      
      setTimeout(() => {
        fetchConversation()
      }, 5000);
      setMessagesForSelectedConv(updatedMessages);
      setInput('');
      setIsTyping(true);

      setTimeout(() => {
        fetchConversation()
      }, 8000);

    };
  
    return (
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          conversations={conversations}
          onNewConversation={handleNewConversation}
          onSelectConversation={handleSelectConversation}
          selectedId={selectedConvId}
        />
  
        {/* Chat */}
        <div className="flex-1 flex flex-col h-screen bg-gray-50">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {selectedConv?.messages?.map((msg) => (
              <ReactFlowProvider key={msg.id}>
                <ChatBubble {...msg} />
              </ReactFlowProvider>
            ))}
            {isTyping && (
              <div className="self-start text-sm text-gray-500 italic animate-pulse">
                DBConcept écrit...
              </div>
            )}
          </div>
  
          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t bg-white flex items-center justify-between gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Décris ton besoin en MCD..."
              className="flex-1 px-4 py-3 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full transition duration-200 shadow"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default Chat;