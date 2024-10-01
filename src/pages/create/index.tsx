import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {isTeacher} from '../../utils/auth';
import "./create.css"

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!isTeacher()) {
      router.push('/');
    }
    const userEmail = localStorage.getItem('email');
    setUserEmail(userEmail);
    if (!userEmail) {
      console.error('Usuário não está logado');
      return;
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Botão clicado, função handleSubmit chamada!');

    if (!userEmail) {
      console.error('Usuário não está logado');
      return;
    }

    const newPost = {
      title, content, authorEmail: userEmail,
    };

    try {
      const response = await fetch('http://localhost:3001/post', {
        method: 'POST', headers: {
          'Content-Type': 'application/json',
        }, body: JSON.stringify(newPost),
      });

      if (response.ok) {
        router.push('/posts');
      } else {
        const errorData = await response.json();
        console.error('Erro ao criar o post:', errorData);
      }
    } catch (error) {
      console.error('Erro ao criar o post:', error);
    }
  };

  return (<div className="flex flex-col items-center p-4 bg-background-900 min-h-screen">
    <div className="header">
      <h1>Criar Novo Post</h1>
      <button id="voltar" onClick={() => router.back()}>
        Voltar
      </button>
    </div>
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Detalhes do Post</h2>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        type="text"
        required
        placeholder="Título do post"/>
      <textarea
        value={content}
        rows="10"
        required
        placeholder="Conteúdo do post"
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Criar Post</button>
    </form>

  </div>);
}
