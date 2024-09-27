import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { Bounce, ToastContainer, toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'

export default function Register() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('') 

    const handleLogin = async (e: { preventDefault: () => void }) => {
        e.preventDefault()
        console.log('Registrando usuário:', { name, email, password, role })

        const response = await fetch('http://localhost:3001/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, role }), 
        })

        if (response.ok) {
            const user = await response.json()
            console.log('Usuario criado: ', user)
            router.push('/')
        } else {
            const errorData = await response.json();
            toast.error(`Erro ao registrar o usuário: ${errorData.error}`, {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                transition: Bounce,
            })
        }
    }

    return (
        <main className="flex flex-1 flex-col h-screen w-screen justify-center items-center bg-background-900">
            <p className="font-sans text-2xl text-fontColor-900">Fiap blog</p>
            <div className="flex flex-1 flex-col max-h-[45vh] w-[80vw] justify-center items-center bg-background-800 rounded-[10px]">
                <p className="font-sans text-lg mb-2 text-fontColor-900 bg-background-800">Digite um nome de usuário</p>
                <input
                    className="font-sans text-lg text-center text-fontColor-900 bg-background-900 border border-fontColor-900 rounded-3xl p-2 w-5/6"
                    type="text"
                    placeholder=""
                    onChange={(e) => setName(e.target.value)}
                />
                <p className="font-sans text-lg mt-2 mb-2 text-fontColor-900 bg-background-800">Digite seu email</p>
                <input
                    className="font-sans text-lg text-center text-fontColor-900 bg-background-900 border border-fontColor-900 rounded-3xl p-2 w-5/6"
                    type="email"
                    placeholder=""
                    onChange={(e) => setEmail(e.target.value)}
                />
                <p className="font-sans text-lg mt-2 mb-2 text-fontColor-900 bg-background-800">Digite sua senha</p>
                <input
                    className="font-sans text-lg text-center text-fontColor-900 bg-background-900 border border-fontColor-900 rounded-3xl p-2 w-5/6"
                    type="password"
                    placeholder=""
                    onChange={(e) => setPassword(e.target.value)}
                />

 
                <p className="font-sans text-lg mt-2 mb-2 text-fontColor-900 bg-background-800">Selecione seu papel:</p>
                <select
                    className="font-sans text-lg text-fontColor-900 bg-background-900 border border-fontColor-900 rounded-3xl p-2 w-5/6"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="">Selecione um papel</option> 
                    <option value="student">Aluno</option>
                    <option value="teacher">Professor</option>
                </select>


                <div className="flex flex-1 flex-row mt-2 w-[40%] max-h-12 ml-auto mr-auto justify-between items-center">
                    <Link
                        className="w-32 mt-2 text-center font-sans bg-background-800 rounded-xl border border-fontColor-900 hover:opacity-80 text-[#fff]"
                        href={"/"}
                    >
                        Voltar
                    </Link>
                    <button
                        disabled={(password === '' || name === '' || email === '')}
                        className="w-32 mt-2 font-sans bg-fontColor-900 rounded-xl hover:opacity-80 text-[#fff]"
                        onClick={handleLogin}
                    >
                        Cadastrar
                    </button>
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
    )
}
