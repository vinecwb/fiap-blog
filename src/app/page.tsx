'use client'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { Bounce, ToastContainer, toast } from "react-toastify";

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  const handleLogin = async (e: any) => {
    e.preventDefault()

    try {
      const res = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
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

  return (
    <main className="flex flex-1 flex-col h-screen w-screen justify-center items-center bg-background-900">
      <p className="font-sans text-2xl text-fontColor-900">Fiap blog</p>
      <div className="flex flex-1 flex-col max-h-[45vh] w-[80vw] justify-center items-center bg-background-800 rounded-[10px]">
        <p className="font-sans text-lg mb-2 text-fontColor-900 bg-background-800">Digite seu email:</p>
        <input className="font-sans text-lg text-fontColor-900 bg-background-900 border border-fontColor-900 rounded-3xl p-2 w-5/6"
          type="email"
          placeholder=""
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="font-sans text-lg mt-2 mb-2 text-fontColor-900 bg-background-800">Digite sua senha:</p>
        <input className="font-sans text-lg text-fontColor-900 bg-background-900 border border-fontColor-900 rounded-3xl p-2 w-5/6"
          type="password"
          placeholder=""
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex flex-1 flex-row mt-2 w-[40%] max-h-12 flex-nowrap ml-auto mr-auto justify-between  items-center">
          <Link
            className="mt-2 text-center p-2 font-sans bg-fontColor-900 flex-wrap rounded-xl hover:opacity-80 text-[#fff]"
            href="register">
            Crie seu cadastro</Link>
          <button disabled={(password == '' || email == '')} className="w-32 mt-2 p-2 ml-1 font-sans bg-fontColor-900 rounded-xl hover:opacity-80 text-[#fff]"
            onClick={handleLogin}
          >Entrar</button>
        </div>
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
    </main>
  );
}