import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface IPost {
    id: number;
    title: string;
    content: string;
    authorId: number;
    published: boolean;
}

export async function getServerSideProps() {
    try {
        const response = await fetch('http://localhost:3001/posts/admin');
        if (!response.ok) throw new Error('Erro ao buscar posts');
        const posts = await response.json();
        return { props: { posts } };
    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        return { props: { posts: [] } };
    }
}

export default function AdminPostsPage({ posts }: { posts: IPost[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState<IPost[]>(posts);
    const postContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setFilteredPosts(posts);
    }, [posts]);

    const handleSearch = (event: React.FormEvent) => {
        event.preventDefault();
        if (!searchQuery) {
            setFilteredPosts(posts);
            return;
        }

        const filtered = posts.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPosts(filtered);
    };

    const publishPost = async (id: number) => {
        const response = await fetch(`http://localhost:3001/post/publish/${id}`, {
            method: 'PUT',
        });
        if (response.ok) {
            // Atualizar a lista de posts
            const updatedPosts = filteredPosts.map(post => 
                post.id === id ? { ...post, published: true } : post
            );
            setFilteredPosts(updatedPosts);
        } else {
            console.error('Erro ao publicar post');
        }
    };

    const editPost = async (id: number) => {
        const title = prompt("Novo título:");
        const content = prompt("Novo conteúdo:");

        if (title && content) {
            const response = await fetch(`http://localhost:3001/post/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, content, published: false }),
            });

            if (response.ok) {
                const updatedPost = await response.json();
                const updatedPosts = filteredPosts.map(post => 
                    post.id === id ? updatedPost : post
                );
                setFilteredPosts(updatedPosts);
            } else {
                console.error('Erro ao editar post');
            }
        }
    };

    const deletePost = async (id: number) => {
        const confirmDelete = confirm("Tem certeza que deseja excluir este post?");
        if (confirmDelete) {
            const response = await fetch(`http://localhost:3001/post/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                const updatedPosts = filteredPosts.filter(post => post.id !== id);
                setFilteredPosts(updatedPosts);
            } else {
                console.error('Erro ao excluir post');
            }
        }
    };

    return (
        <div className="flex flex-col items-center p-4 bg-background-900 min-h-screen">
            <h1 className="text-3xl font-bold mb-4 text-fontColor-900">Tela Administrativa de Posts</h1>
            
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
                {filteredPosts.map((post) => (
                    <div key={post.id} className="bg-background-800 border border-fontColor-900 p-4 mb-4 rounded shadow">
                        <Link href={`/posts/${post.id}`}>
                            <h3 className="text-xl font-semibold text-fontColor-900">{post.title}</h3>
                        </Link>
                        <p className="text-gray-700">{post.content}</p>
                        <p className="text-sm text-gray-500">Autor: {post.authorId || 'Desconhecido'}</p>
                        <p className="text-sm text-gray-500">Publicado: {post.published ? 'Sim' : 'Não'}</p>
                        
                        <div className="flex space-x-2 mt-4">
                            <button 
                                onClick={() => publishPost(post.id)} 
                                className="bg-green-500 text-white p-2 rounded"
                            >
                                ✔️
                            </button>
                            <button 
                                onClick={() => editPost(post.id)} 
                                className="bg-blue-500 text-white p-2 rounded"
                            >
                                ✏️
                            </button>
                            <button 
                                onClick={() => deletePost(post.id)} 
                                className="bg-red-500 text-white p-2 rounded"
                            >
                                ❌
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
