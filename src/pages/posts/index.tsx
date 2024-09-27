import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface IPost {
    id: number; // Adicionando ID do post
    title: string;
    content: string;
    authorId: number;
}

export async function getServerSideProps(context) {
    const { params, query } = context;
    const recipientId = query.recipientId;

    if (!recipientId) {
        console.error('recipientId is not defined');
        return { props: { userSender: null, senderId: null } };
    }

    try {
        const response = await fetch(`http://localhost:3001/users/${recipientId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            const userSender = await response.json();
            return { props: { userSender, senderId: query.senderId } };
        } else {
            return { props: { userSender: null, senderId: null } };
        }
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        return { props: { userSender: null, senderId: null } };
    }
}

export default function PostPage({ userSender, senderId }) {
    const router = useRouter();
    const { recipientId } = router.query;
    const [userName, setUserName] = useState('');
    const [posts, setPosts] = useState<IPost[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [authors, setAuthors] = useState<{ [key: number]: string }>({});
    const postContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:3001/posts');
                if (!response.ok) throw new Error('Erro ao buscar posts');
                const data = await response.json();
                setPosts(data);
                
                // Buscar informações dos autores
                const authorIds = [...new Set(data.map(post => post.authorId))]; // IDs únicos dos autores
                const authorPromises = authorIds.map(id => 
                    fetch(`http://localhost:3001/users/${id}`).then(res => res.json())
                );
                const authorData = await Promise.all(authorPromises);
                const authorMap = authorData.reduce((acc, author) => {
                    acc[author.id] = author.email; // Mapeando ID do autor para o email
                    return acc;
                }, {});
                setAuthors(authorMap);
            } catch (error) {
                console.error('Erro ao buscar posts:', error);
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        if (userSender) {
            setUserName(userSender.name);
        }
    }, [userSender]);

    const handleSearch = async (event) => {
        event.preventDefault();
        if (!searchQuery) return;

        try {
            const response = await fetch(`http://localhost:3001/posts/search?query=${searchQuery}`);
            if (!response.ok) throw new Error('Erro ao buscar posts');
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Erro ao buscar posts:', error);
        }
    };

    useEffect(() => {
        postContainer.current?.scrollTo(0, postContainer.current.scrollHeight);
    }, [posts]);

    return (
        <div className="flex flex-col items-center p-4 bg-background-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-fontColor-900">Tela de Posts</h1>
            
            {/* Botão para criar um novo post */}
            <Link href="/create">
                <button className="mb-4 bg-fontColor-900 text-white rounded py-2 px-4 hover:opacity-80">
                    Criar Novo Post
                </button>
            </Link>

            {/* Campo de busca */}
            <form onSubmit={handleSearch} className="mb-4">
                <input
                    type="text"
                    placeholder="Buscar posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-fontColor-900 p-2 rounded mb-4 bg-background-900 text-fontColor-900"
                />
                <button type="submit" className="m-4 bg-fontColor-900 text-white rounded py-2 px-4 hover:opacity-80">Buscar</button>
            </form>

            <div ref={postContainer} className="w-full max-w-lg">
                {posts.map((post) => (
                    <div key={post.id} className="bg-background-800 border border-fontColor-900 p-4 mb-4 rounded shadow">
                        <Link href={`/posts/${post.id}`}>
                            <h3 className="text-xl font-semibold text-fontColor-900">{post.title}</h3>
                        </Link>
                        <p className="text-gray-700">{post.content}</p>
                        <p className="text-sm text-gray-500">Autor: {authors[post.authorId] || 'Desconhecido'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
