import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./styles/whatsapp.css";
import MenuLateral from "./components/MenuLateral";



function App() {
  // Estado para almacenar el chat seleccionado
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  // Estado para controlar la visibilidad de la barra lateral, las variables booleanas suelen empezar por is
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Función para alternar la visibilidad de la barra lateral
  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <div className="app">
      {/* Botón de menú para abrir/cerrar la lista de chats en pantallas pequeñas
      
      Renderizo condicional, solo sale el botón cuando no está visible la sidebar*/}
      <MenuLateral></MenuLateral>
      {!isSidebarOpen && (
        <button className="menu-button" onClick={toggleSidebar}>
          Abrir Chats
        </button>
      )}

      {/* La barra lateral se muestra o se oculta según el estado `isSidebarOpen` 
      Parametros:
      - onSelectChat funcion callback en este caso cambio el estado de selectedChat
      - isOpen: booleano para saber si la barra está abierta, paso el estado isSidebarOpen
      - onClose: funcion callback para cambiar el estado del padre osea App al cerrar el sidebar
      */}
     
      <Sidebar
        onSelectChat={setSelectedChat}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        conversations ={conversations}
        setConversations ={setConversations}
      />
       

      {/* Ventana de chat principal */}
      <ChatWindow selectedChat={selectedChat} setSelectedChat={setSelectedChat} conversations={conversations} setConversations ={setConversations} />
    </div>
  );
}

export default App;
