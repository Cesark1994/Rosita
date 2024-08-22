import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chat.css';

// Componente funcional Chat
export function Chat() {
  // Estados para almacenar los mensajes y el nuevo mensaje
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [servers, setServers] = useState([]);
  const [channels, setChannels] = useState([]);
  const navigate = useNavigate(); // Hook para navegar entre rutas

  // Función para enviar un nuevo mensaje
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, id: Date.now() }]);
      setNewMessage('');
    }
  };

  // Función para eliminar un mensaje por ID
  const handleDeleteMessage = (id) => {
    setMessages(messages.filter(message => message.id !== id));
  };

  // Función para crear un nuevo servidor
  const handleCreateServer = () => {
    const serverName = prompt('Nombre del nuevo servidor:');
    if (serverName) {
      setServers([...servers, { id: Date.now(), name: serverName }]);
    }
  };

  // Función para crear un nuevo canal
  const handleCreateChannel = () => {
    const channelName = prompt('Nombre del nuevo canal:');
    if (channelName) {
      setChannels([...channels, { id: Date.now(), name: channelName }]);
    }
  };

  // Renderizado del componente
  return (
    <div className="chat-layout">
      <div className="sidebar">
        <div className="servers">
          <h3>Servidores</h3>
          <button className="create-btn" onClick={handleCreateServer}>Crear Servidor</button>
          <ul>
            {servers.map(server => (
              <li key={server.id}>{server.name}</li>
            ))}
          </ul>
        </div>
        <div className="channels">
          <h3>Canales</h3>
          <button className="create-btn" onClick={handleCreateChannel}>Crear Canal</button>
          <ul>
            {channels.map(channel => (
              <li key={channel.id}>{channel.name}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="chat-container">
        {/* Contenedor de mensajes */}
        <div className="messages">
          {messages.map((message) => (
            <div key={message.id} className="message">
              {message.text}
              {/* Botón para eliminar el mensaje */}
              <button
                className="delete-btn"
                onClick={() => handleDeleteMessage(message.id)}
              >
                X
              </button>
            </div>
          ))}
        </div>
        {/* Contenedor de entrada de mensajes */}
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
          />
          <button onClick={handleSendMessage}>Enviar</button>
        </div>
        {/* Botón para volver a la ruta principal */}
        <button onClick={() => navigate('/principal')}>Volver al Principal</button>
      </div>
    </div>
  );
}


