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

    if (!post) return <div>Loading...</div>;

    return (
        <div className="post-detail">
            <h1>{post.title}</h1>
            <p>{post.content}</p>
            <h2>Comentários:</h2>
            <div>
                {comments.map((comment) => (
                    <div key={comment.id}>
                        <p>{comment.content} - <strong>{comment.author?.email || 'Desconhecido'}</strong></p>
                    </div>
                ))}
            </div>
            <form onSubmit={handleCommentSubmit}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                />
                <button type="submit">Adicionar Comentário</button>
            </form>
        </div>
    );
}
