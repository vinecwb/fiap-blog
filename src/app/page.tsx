'use client'
import {useRouter} from "next/navigation";
import {useState} from "react"
import {Bounce, toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import "./page.css"

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const handleLogin = async (e: any) => {
    e.preventDefault()

    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST', headers: {
          'Content-Type': 'application/json',
        }, body: JSON.stringify({email, password}),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token); // Armazenando o token
        localStorage.setItem('email', email)
        router.push('/posts'); // Redireciona para a página de posts

      } else {
        toast.error(`Erro ao efetuar o login do usuário`, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        throw new Error(data.message || 'Problema na autenticação')
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (<main className="flex flex-1 flex-col h-screen w-screen justify-center items-center bg-background-900">
    <p className="font-sans text-2xl text-fontColor-900 no-select">FIAP BLOG</p>
    <div className="container">
      <h2 className="title no-select">
        Login
      </h2>
      <input
        className="email-field"
        type="text"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="password-field"
        type="password"
        placeholder="Senha"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-button" disabled={(password == '' || email == '')} onClick={handleLogin}>
        Entrar
      </button>
      <a href="register" className="no-select register-button">
        Cadastrar
      </a>
    </div>

    <ToastContainer
      position="bottom-center"
      autoClose={5000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="colored"
      transition={Bounce}
    />
  </main>);
}