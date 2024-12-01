import { useState } from "react";
import Message from "./Message";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Fab from "@mui/material/Fab";
import Avatar from "@mui/material/Avatar";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import "../styles/chatWindow.css";
import "https://kit.fontawesome.com/23a2b9705b.js";


/* eslint-disable react/prop-types */
// VARIABLES GLOBALES
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;


const supabase = createClient(supabaseUrl, supabaseKey);

function ChatWindow({ selectedChat, setSelectedChat, conversations, setConversations }) {
 
  const [lastMessage, setLastMessage] = useState("")
  const [newMessage, setNewMessage] = useState("");
  const [participante, setParticipante] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  async function limpiarChat() {
  
  if(confirm("¿Estas seguro de que quieres limpiar la conversacion?"))  {
    const { data, error } = await supabase
    .from('Conversaciones')
    .update({ conversation: "" })
    .eq("id",selectedChat.id)
    .select()
      

    if(error){
      console.error("Error al limpiar las conversaciones: " + error)
    }else{
      console.log(data)
      setSelectedChat((prevChat) => ({
        ...prevChat,
        conversation: "", 
    }));
    setConversations((prevConversations) =>
      prevConversations.map((chat) =>
        chat.id === selectedChat.id
          ? { ...chat, conversation: "" }
          : chat
      )
    );
    }
  }else{
    alert("Has cancelado la accion de limpiar")
  }

  const { data2, error } = await supabase
    .from('Conversaciones')
    .update({ last_message: "" })
    .eq("id",selectedChat.id)
    .select()
   
    
  }

  async function borrarChat() {
  
    if(confirm("¿Estas seguro de que quieres borrar la conversacion?"))  {

      const { error } = await supabase
      .from('Conversaciones')
      .delete()
      .eq("id",selectedChat.id)

        
  
      if(error){
        console.error("Error al borrar las conversaciones: " + error)
      }else{
        setSelectedChat(null);
        setConversations(prevConversations =>
          prevConversations.filter(chat => chat.id !== selectedChat.id)
        )
      }
    }else{
      alert("Has cancelado la accion de borrar")
    }
     
      
    }


  async function cogerParticipante() {
    console.log(selectedChat)
    setIsLoading(true); // Inicia la carga
    const idOtro = selectedChat.participants.find(
      (e) => e !== sessionStorage.getItem("userId") 
    );
  
    let { data: Users, error } = await supabase
      .from("Users")
      .select("*")
      .eq("userId", idOtro);
  
    if (error) {
      console.log("Error al coger el usuario: ", error);
    } else {
      setParticipante(Users);
    }
    setIsLoading(false); // Finaliza la carga
  }

  useEffect(() => {
    if (selectedChat) {
    cogerParticipante();
    }else{
      console.log("xxxxxxx")
    }
  }, [selectedChat]);

  useEffect(() => {
    if (conversations.length > 0 && selectedChat) {
      const updatedChat = conversations.find((chat) => chat.id === selectedChat.id);
      if (updatedChat) {
        setSelectedChat(updatedChat);
      }
    }
  }, [conversations]);

  
  async function insertarMensaje() {
    const plantillaNuevoMensaje = {
      id: selectedChat.conversation.length + 1,
      text: newMessage,
      sender: sessionStorage.getItem("userId"),
    };
  
    const actualizarConver =
      selectedChat.conversation.length !== 0
        ? [...selectedChat.conversation, plantillaNuevoMensaje]
        : [plantillaNuevoMensaje];
  
    const { data, error } = await supabase
      .from("Conversaciones")
      .update({ conversation: actualizarConver })
      .eq("id", selectedChat.id)
      .select();
  
    if (error) {
      console.log("Error en update:", error);
    } else {
      console.log(data);
  
      setSelectedChat({
        ...selectedChat,
        conversation: actualizarConver,
      });

      setConversations((prevConversations) =>
        prevConversations.map((chat) =>
          chat.id === selectedChat.id
            ? { ...chat, conversation: actualizarConver }
            : chat
        )
      );


    }
  }

  async function ActUltimoMensaje() {
    // setLastMessage(newMessage);
    
    const { data, error } = await supabase
    .from('Conversaciones')
    .update({ last_message: lastMessage })
    .eq("id", selectedChat.id)
    .select()

    if(error){
      console.error("Ha habido un error al actualizar el ultimo Mensaje: " + error);
    }else{
      console.log("Todo bien al actulaizar el ultimo mensaje: "+ data)
    }
        
    
  }

  useEffect(() => {
    // console.log("lastMessage:", lastMessage);
    // console.log("selectedChat:", selectedChat);
    if (lastMessage && selectedChat?.id) {
        ActUltimoMensaje();
    }
}, [lastMessage]);


  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setLastMessage(newMessage);
      setNewMessage("");
      
      insertarMensaje()
      
    }
 
  };

 
  if (!selectedChat) {
    return <div className="chat-window selNewChat">Selecciona un chat...</div>;
  }
  // {console.log(selectedChat)}

  
  return (
    <div className="chat-window">
      <div className="chat-header">

        {participante.length > 0 && participante[0].image ? (
         <img src={participante[0].image} className='foto-chatwindow' alt={participante[0].nombre} />
        ) : (
          <Avatar>{participante[0]?.nombre.charAt(0).toUpperCase()}</Avatar>
        )}
      {isLoading ? (
      <div style={{color: "white"}}>Cargando participante...</div>
    ) : (
      <div className="chat-header2">
        <h3>{participante[0]?.nombre}</h3>
        <div className="iconos-header">
        <i className="fa-solid fa-broom" style={{color: "#ffffff"}} onClick={()=> limpiarChat()}></i>
        <i className="fa-solid fa-trash-can" style={{color: "#ffffff"}} onClick={()=> borrarChat()}></i>
        </div>
      </div>
    )}
        
    

      </div>
      <div className="messages">
       
       {selectedChat.conversation ? selectedChat.conversation.map((message) => (
          <Message
            key={message.id}
            text={message.text}
            sender={message.sender}
          />
        )):<div> No hay mensajes</div>}
      </div>
      <div className="input-box">
        <input
          type="text"
          className="inputMensaje"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder="Escribe un mensaje"
        />
        <Fab
          variant="extended"
          id="botonInt"
          onClick={()=> handleSendMessage()}
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
            borderRadius: "5px 5px 5px 5px",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)", // Fondo sutilmente gris o transparente en hover
              boxShadow: "none", // Elimina sombra en hover también
              borderRadius: "5px 5px 5px 5px"
            },
          }}
        >
          <SendIcon sx={{ color: "#ffffff" }} />
        </Fab>
        <Fab
          variant="extended"
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
            borderRadius: "5px 5px 5px 5px",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)", // Fondo sutil en hover
              boxShadow: "none",
              borderRadius: "5px 5px 5px 5px"
            },
          }}
        >
          <AttachFileIcon sx={{ color: "#ffffff" }} />
        </Fab>
      </div>
    </div>
  );
}

export default ChatWindow;
