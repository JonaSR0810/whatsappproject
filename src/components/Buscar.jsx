import "../styles/Buscar.css"
import "https://kit.fontawesome.com/23a2b9705b.js";
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
// const apptitle = import.meta.env.VITE_TITLE;
const supabase = createClient(supabaseUrl, supabaseKey);
/* eslint-disable react/prop-types */
function Buscar(){
    const [usuarios,setUsuarios] = useState([])
    const [mostrar,setMostrar] = useState([])

    function mostrarMenu(){

        const menuBuscar = document.getElementById("resultadoBusqueda")
            menuBuscar.style.display = "flex";

    }

    function ocultarMenu(){
        const menuBuscar = document.getElementById("resultadoBusqueda")
        menuBuscar.style.display = "none";
    }
           
    
    
    async function buscarTodo() {
        const inputBuscar = document.getElementById("buscar").value.trim(); 
        const idUser= sessionStorage.getItem("userId")
        const { data: Users, error } = await supabase
            .from('Users')
            .select('*')
            .neq("userId",idUser)
            
    
        if (error) {
            console.error("Error al obtener los usuarios: ", error);
            return; 
        }
    
        if (inputBuscar === "") {
            setMostrar([]);
            return; 
        }else{
            setUsuarios(Users)
        }

        const inputFiltro = inputBuscar.toLowerCase();
        const filtrado = Users.filter((e) => 
            e.nombre && e.nombre.toLowerCase().includes(inputFiltro) 
        );
    
        setMostrar(filtrado);
    }

    async function crearChat(userId2) {
        const userId = sessionStorage.getItem('userId');
        console.log(userId)
    
        const { data, error } = await supabase
            .from('Conversaciones')
            .insert([
                {
                    conversation: '', 
                    last_message: '',
                    participants: [userId, userId2]
                },
            ])
            .select();
    
        if (error) {
            console.error("Error al crear el chat: ", error);
        } else {
            console.log("Chat creado: ", data);
            window.location.reload()
        }
    }


    
    return(
        <>
        <div className="inputBusqueda">
            <input type="text" name="buscar" id="buscar" placeholder=" Inicia tu busqueda" onChange={()=> buscarTodo()} onFocus={()=> mostrarMenu()}  ></input><i className="fa-solid fa-magnifying-glass lupa"></i>
        </div>

        <div id="resultadoBusqueda" className="resultadoBusqueda">
            
        {usuarios.length === 0 ? <p>No hay resultados</p> : (mostrar.map((e) => ( <button key={e.id} className="resBusquedaBoton" onClick={()=> [crearChat(e.userId) ,ocultarMenu()]}>{e.nombre}</button> 
))
)}
            
        </div>
        </>
    )
}


export default Buscar