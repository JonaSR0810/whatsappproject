import { createClient } from '@supabase/supabase-js'


const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL
const supabaseKey  = import.meta.env.VITE_SUPABASE_KEY

const supabase = createClient(supabaseUrl,supabaseKey)



const form = document.getElementById("formularioRegister")


form.addEventListener("submit",async () => {
    const nombre = document.getElementById("nombre").value;
    const usuario = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log(email)
    console.log(password)

    let { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      })

    sessionStorage.setItem('access_token',data.session.access_token)
    sessionStorage.setItem('refresh_token',data.session.refresh_token)
    sessionStorage.setItem('userId', data.user.id)
    const userId=data.user.id

    const { dataIns, errorIns } = await supabase
    .from('Users')
    .insert([
      { nombre: nombre,
         usuario: usuario,
         email: email,
         password: password,
         userId: userId
        },
    ])
    .select()

    window.location.href = "./index.html"

}
 )



