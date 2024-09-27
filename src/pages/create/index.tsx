import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { isTeacher } from '../../utils/auth';


export default function CreatePost() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        if (!isTeacher()) {
            router.push('/'); // Redireciona se não for teacher
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
            title,
            content,
            authorEmail: userEmail,
        };

        try {
            const response = await fetch('http://localhost:3001/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPost),
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

    return (
        <div className="flex flex-col items-center p-4 bg-background-900 min-h-screen">
            <div className="flex justify-end w-full mb-4">
                <button 
                    onClick={() => router.back()} 
                    className="bg-fontColor-900 text-white rounded py-2 px-4 hover:opacity-80 mr-2"
                >
                    Voltar
                </button>
            </div>

            <h1 className="text-3xl font-bold mb-4 text-fontColor-900">Criar Novo Post</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-background-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <input
                    type="text"
                    placeholder="Título do post"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="border border-fontColor-900 p-2 w-full rounded mb-4 bg-background-900 text-fontColor-900"
                />
                <textarea
                    placeholder="Conteúdo do post"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="border border-fontColor-900 p-2 w-full rounded mb-4 bg-background-900 text-fontColor-900"
                />
                <button type="submit" className="bg-fontColor-900 text-white rounded py-2 px-4 hover:opacity-80">Criar Post</button>
            </form>
        </div>
    );
}
