import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import '../styles/chatlist.css'
import Avatar from '@mui/material/Avatar';
import Buscar from './Buscar';




const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
// const apptitle = import.meta.env.VITE_TITLE;
const supabase = createClient(supabaseUrl, supabaseKey);
/* eslint-disable react/prop-types */
function ChatList({ onSelectChat, conversations,setConversations}) {
 
  const [participantes, setParticipantes] = useState({})

  useEffect(() => {
    async function mostrarConversations() {
      const userId = sessionStorage.getItem("userId")
      let { data: Conversaciones, error } = await supabase
        .from('Conversaciones')
        .select('*')
        .contains('participants', [userId]);

      if (error) {
        console.log('Error al mostrar las conversaciones:', error);
      }
      setConversations(Conversaciones)

      const idparticipante = Conversaciones.map((e) => e.participants.find((i) => i != userId))

      let { data: Users, error2 } = await supabase
      .from('Users')
      .select('*')
      .in('userId',idparticipante)

      if(error2){
        console.log("Error: "+error2)
      }else {
  let acc = {};
  Users.forEach((x) => { acc[x.userId] = x });

  setParticipantes(acc);
      }
    }

    mostrarConversations();
    
  }, [setConversations]);
 
  subscribirChat()

  function subscribirChat(){
    const canal = supabase
    .channel("ChannelConver")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "Conversaciones" },
      (payload) => {
        setConversations((e) => [...e, payload.new])
      },
    )

    .on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: "Conversaciones" },
      (payload) => {
        setConversations((e) => e.filter((i)=> i.id != payload.old.id))
      },
    )
    
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "Conversaciones" },
      (payload) => {
        setConversations((e) =>
          e.map((i) =>
            i.id === payload.new.id ? payload.new : i
          )
        );
      }
    ).subscribe();
  return () => {
    supabase.removeChannel(canal);
  };
  }

  
  
  return (
    <div className="chat-list">
      <Buscar conversacion={conversations}></Buscar>
      {conversations.length > 0 ? 
        conversations.map((e) => {
          const otro = e.participants.find((i) => i !== sessionStorage.getItem("userId"));
          const participanteFinal = participantes[otro];
          if (!participanteFinal) {
            return <p key={e.id} style={{color: "white"}}>Cargando participante...</p>;
          }

          return (
            <div key={e.id} className="chat-item" onClick={() => onSelectChat(e)}>
              <div className="chat-container">
                {participanteFinal.image ? (
                  <img src={participanteFinal.image} className='foto-chatlist' alt={participanteFinal.nombre} />
                ) : (
                  <Avatar>{participanteFinal.nombre.charAt(0).toUpperCase()}</Avatar>
                )}
                <div className="chat-info">
                  <h4>{participanteFinal.nombre}</h4>
                  <p><span style={{color: "lightgreen"}}>Ult Mensaje:</span> {e.last_message.length > 0 ? e.last_message : "No hay mensaje"}</p>
                </div>
              </div>
            </div>
          );
        }) :
        <p className="noChats">No hay chats para mostrar</p>
      }
    </div>
  );

}

export default ChatList