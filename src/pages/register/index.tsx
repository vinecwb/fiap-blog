import {useRouter} from "next/router"
import {useState} from "react"
import {Bounce, toast, ToastContainer} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import "./register.css"

export default function Register() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('teacher')

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    console.log('Registrando usuário:', {name, email, password, role})

    const response = await fetch('http://localhost:3001/auth/register', {
      method: 'POST', headers: {
        'Content-Type': 'application/json',
      }, body: JSON.stringify({name, email, password, role}),
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

  const selectRole = (role: string) => {
    setRole(role)
    document.getElementById('teacher')!.classList.remove('active')
    document.getElementById('student')!.classList.remove('active')
    document.getElementById(role)!.classList.add('active')
  }

  const handleBack = () => {
    router.push("/");
  }

  return (<main className="flex flex-1 flex-col h-screen w-screen justify-center items-center bg-background-900">
    <p className="font-sans text-2xl text-fontColor-900">FIAP BLOG</p>

    <div className="container no-select">
      <h2 className="title">Cadastro</h2>
      <input
        className="name-field"
        type="text"
        placeholder="Nome de Usuário"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="email-field"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="password-field"
        type="password"
        placeholder="Senha"
        onChange={(e) => setPassword(e.target.value)}
      />
      <h2 className="text-fontColor-900">Selecione seu papel</h2>
      <div className="toggle-buttons">
        <div id="teacher" className="active" onClick={() => selectRole('teacher')}>Professor</div>
        <div id="student" onClick={() => selectRole('student')}>Aluno</div>
      </div>
      <input type="hidden" id="role" value="professor"/>
      <div className="flex flex-1 gap-4">
        <button onClick={handleBack} className="back-button text-white rounded">
          Voltar
        </button>
        <button
          className="register-button"
          disabled={(password === '' || name === '' || email === '')}
          onClick={handleLogin}
        >
          Cadastrar
        </button>
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
    </div>
  </main>)
}
