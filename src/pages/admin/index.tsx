import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { isTeacher } from '../../utils/auth';
import "./admin.css"
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
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState<IPost[]>(posts);
    const [errorMessage, setErrorMessage] = useState('');
    const postContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isTeacher()) {
            router.push('/'); 
        }
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
          <div className="header">
              <h1>Tela Administrativa de Posts</h1>
              <button id="voltar" onClick={() => window.history.back()}>Voltar</button>
          </div>

          {errorMessage && (
            <div className="mb-4 text-red-500">{errorMessage}</div>
          )}

          <form onSubmit={handleSearch}  className="search-bar">
              <input
                type="text"
                placeholder="Buscar posts..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">Buscar</button>
          </form>
          <div ref={postContainer} className="post2">
              {filteredPosts.map((post) => (
                <div key={post.id} className="post-card p-4 mb-4">
                    <div className="post2-title-buttons">
                        <h3 className="text-xl font-semibold text-fontColor-900">{post.title}</h3>
                        <div>
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
                    <Link href={`/posts/${post.id}`}>
                        <p className="text-gray-700">{post.content}</p>
                        <p className="text-sm text-gray-500">Autor: {post.authorId || 'Desconhecido'}</p>
                        <span>Publicado: {post.published ? 'Sim' : 'Não'}</span>
                    </Link>

                </div>
              ))}
          </div>
      </div>
    );
}
