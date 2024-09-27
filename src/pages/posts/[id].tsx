import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PostDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [authorId, setAuthorId] = useState(null); // Pegar do localStorage ou do contexto

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) return;
            const response = await fetch(`http://localhost:3001/post/${id}`);
            const data = await response.json();
            setPost(data);
        };

        const fetchComments = async () => {
            if (!id) return;
            const response = await fetch(`http://localhost:3001/posts/${id}/comments`);
            const data = await response.json();
            setComments(data);
        };

        fetchPost();
        fetchComments();
    }, [id]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:3001/posts/${id}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: newComment, authorId }),
        });

        const commentData = await response.json();
        setComments((prev) => [...prev, commentData]);
        setNewComment('');
    };

    if (!post) return <div className="text-center text-fontColor-900">Loading...</div>;

    return (
        <div className="flex flex-col items-center p-4 bg-background-900 min-h-screen">
            <div className="bg-background-800 border border-fontColor-900 p-4 rounded shadow w-full max-w-lg">
                <h1 className="text-3xl font-bold mb-2 text-fontColor-900">{post.title}</h1>
                <p className="text-gray-700 mb-4">{post.content}</p>

                <h2 className="text-2xl font-semibold mt-4 mb-2 text-fontColor-900">Comentários:</h2>
                <div className="mb-4">
                    {comments.length > 0 ? comments.map((comment) => (
                        <div key={comment.id} className="border-b border-gray-300 py-2">
                            <p className="text-gray-700">{comment.content} - <strong>{comment.author?.email || 'Desconhecido'}</strong></p>
                        </div>
                    )) : (
                        <p className="text-gray-500">Nenhum comentário ainda.</p>
                    )}
                </div>

                <form onSubmit={handleCommentSubmit} className="flex flex-col">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                        className="border border-fontColor-900 p-2 rounded mb-2 bg-background-900 text-fontColor-900"
                        placeholder="Escreva seu comentário..."
                    />
                    <button type="submit" className="bg-fontColor-900 text-white rounded py-2 hover:opacity-80">Adicionar Comentário</button>
                </form>
            </div>
        </div>
    );
}
