import React, { useState } from 'react';
import { FiPlus, FiSettings } from 'react-icons/fi';
import { FaRegComments, FaUserCircle } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa6';
import useDeleteConversation from '../hooks/useDeleteConversation';
import useFetchConversation from '../hooks/useFetchConversation';
import logo from '../assets/logobg.png';


interface Conversation {
  id: string;
  titre: string;
}

interface SidebarProps {
  conversations: Conversation[];
  // SetConversation: () => void;
  onNewConversation: () => void;
  onSelectConversation: (id: string) => void;
  selectedId: string | null;
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  onNewConversation,
  onSelectConversation,
  selectedId,
}) => {
  const { deleteConversation } = useDeleteConversation();
  const { fetchConversation } = useFetchConversation();

  // Fonction de suppression avec rafraîchissement
  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche le clic de sélectionner la conversation
    try {
      await deleteConversation(id);
      // setConversations(conversations.filter(conv => conv.id !== id));
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  return (
    <div className="w-72 h-screen bg-white shadow-lg flex flex-col justify-between border-r">
      {/* Top */}
      <div>
        {/* Logo */}
        <div className="px-6 py-5 flex items-center space-x-3 border-b">
          <div className="w-5 h-5 ">
            <img src={logo} alt="DBConcept Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-lg font-bold text-gray-700 tracking-wide">DBConcept</h1>
        </div>

        {/* New Chat */}
        <div className="p-4">
          <button
            onClick={onNewConversation}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
          >
            <FiPlus />
            <span>Nouveau Chat</span>
          </button>
        </div>

        {/* Chats */}
        <div className="px-4 overflow-y-auto">
          <p className="text-xs text-gray-500 mb-2">Vos modèles</p>
          <ul className="space-y-2 text-sm">
            {conversations.map((conv) => (
              <li
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`flex items-center px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-50 ${
                  selectedId === conv.id ? 'bg-blue-100 text-blue-600 font-semibold' : 'text-gray-700'
                }`}
              >
                <FaRegComments className="mr-2" />
                {conv.titre}
                <FaTrash
                  className="ml-auto hover:text-red-500"
                  onClick={(e) => handleDeleteConversation(conv.id, e)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <div className="flex items-center space-x-2 cursor-pointer hover:text-blue-600">
            <FiSettings />
            <span>Paramètres</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <FaUserCircle className="text-2xl text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-700">Utilisateur</p>
            <p className="text-xs text-gray-400">user@dbconcept.ai</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
