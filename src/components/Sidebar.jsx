import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import ChatList from "./ChatList";
import "../styles/whatsapp.css";


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

/* eslint-disable react/prop-types */
function Sidebar({ onSelectChat, isOpen, onClose,conversations,setConversations }) {
  const [mostrarUsers, setMostrarUsers] = useState(false);
  const [users, setUsers] = useState([]);

  
  async function abrirContactos() {
    try {
      const userId= sessionStorage.getItem('userId')
      let { data: Users, error } = await supabase
      .from("Users")
      .select("*")
      .not('userId', 'eq', userId);

      setUsers(Users);
      setMostrarUsers(true); 
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  }


  function cerrarContactos() {
    setMostrarUsers(false);
  }

  async function crearChat(userId2){
    console.log(userId2)
    const userId= sessionStorage.getItem('userId')

    
    const { data: chatExistente, error2 } = await supabase
    .from('Conversaciones')
    .select('id')
    .contains('participants', [userId, userId2])

    if(error2){
      console.error("Error al mostrar data: " +error2)
      return
    }

    if(chatExistente && chatExistente.length > 0){
      alert("Ya existe un chat con esta persona")
      return;
    }else{
      const { data, error } = await supabase
      .from('Conversaciones')
      .insert([
        { conversation: '', 
          last_message: '',
        participants: [userId,userId2] },
      ])
      .select()
  
      if (error) {
        console.error('Error al crear la conversación:', error);
    } else {
        console.log('Conversación creada:', data);
        window.location.reload()
    }
    }
        


    
        
  }

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <h2>
          <i
            className="fa-brands fa-whatsapp"
            style={{ color: "#15b300", fontSize: "30px" }}
          ></i>{" "}
          Chats
        </h2>
        <i
          className="fa-solid fa-user-plus iconoContacto"
          onClick={abrirContactos} 
        ></i>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
      </div>

      
  
      {mostrarUsers ? (
        <div className="user-list">
          <div className="superior">
          <h3>Tus Contactos</h3>
          <button className="close-button" onClick={cerrarContactos}>
          &times;
          </button>
          </div>
          <ul>
            {users.map((user) => (
              <li key={user.id} className="user-item">
                <button onClick={()=> [crearChat(user.userId) ,cerrarContactos()]}>{user.nombre}</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (

        <ChatList
          onSelectChat={(chat) => {
            onSelectChat(chat);
            onClose();
          }}
          conversations = {conversations}
          setConversations= {setConversations}
        />
      )}
    </div>
  );
}

export default Sidebar;
