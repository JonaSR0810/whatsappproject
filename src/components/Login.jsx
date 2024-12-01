// import React, { useState } from 'react';
// import { createClient } from '@supabase/supabase-js'
import '../styles/Login.css';
import { createClient } from '@supabase/supabase-js'


const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_KEY

const supabase = createClient(supabaseUrl,supabaseKey)

function Login() {


  const handleSubmit = (e) => {
    e.preventDefault();
  };

  async function login(){
    const emailUsuario = document.getElementById('email').value
    const contraseña = document.getElementById('password').value
    
    
      let { data, error } = await supabase.auth.signInWithPassword({
        email: emailUsuario,
        password: contraseña
      })
      sessionStorage.setItem('access_token',data.session.access_token)
    sessionStorage.setItem('refresh_token',data.session.refresh_token)
    sessionStorage.setItem('userId', data.user.id)
      window.location.href = "../../index.html"
  }
  
  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="login-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <h1>Login</h1>
          </div>
          <p>Introduce tus credenciales para acceder a WhatsApp+</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="m@example.com"

            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              required
            />
          </div>
          <button type="button" onClick={login}> Iniciar Sesión </button>
        </form>
        <div className="forgot-password">
          <a href="../../Registro.html">Registrarse</a>
        </div>
      </div>
    </div>
  );
}

export default Login