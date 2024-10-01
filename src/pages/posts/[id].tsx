import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import "./card.css"
import {getUserId} from "@/utils/auth";
import Link from "next/link";

export default function PostDetail() {
  const router = useRouter();
  const {id} = router.query;
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      const response = await fetch(`http://localhost:3001/post/${id}`);
      const data = await response.json();
      setPost(data);
    };

    fetchPost();
    fetchComments();
  }, [id]);

  const fetchComments = async () => {
    if (!id) return;
    const response = await fetch(`http://localhost:3001/posts/${id}/comments`);
    const data = await response.json();
    setComments(data);
  };

  const handleCommentSubmit = async (e) => {
    const authorId = getUserId();
    e.preventDefault();
    const response = await fetch(`http://localhost:3001/posts/${id}/comments`, {
      method: 'POST', headers: {
        'Content-Type': 'application/json',
      }, body: JSON.stringify({content: newComment, authorId}),
    });

    const commentData = await response.json();
    setComments((prev) => [...prev, commentData]);
    setNewComment('');
    await fetchComments();
  };

  if (!post) return <div className="text-center text-fontColor-900">Loading...</div>;

  return (<div className="flex flex-col items-center p-4 bg-background-900 min-h-screen">
    <div className="post1">
      <Link className="back-link" href="/posts"> {'<< Voltar'} </Link>
      <h3>{post.title}</h3>
      <p>{post.content}</p>

      <div className="comment-section">
        <h4>Comentários:</h4>
        {comments.length > 0 ? comments.map((comment) => (<div key={comment.id} className="comment">
          <div key={comment.id} className="border-b border-gray-300 py-2">
            <p className="text-gray-700">
              {comment.content} - <strong> {comment.author?.email || 'Desconhecido'} </strong>
            </p>
          </div>
        </div>)) : (<p>Sem comentários</p>)}
      </div>

      <form onSubmit={handleCommentSubmit} className="add-comment">
        <input
          type="text"
          placeholder="Escreva seu comentário..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        <button type="submit">Adicionar Comentário</button>
      </form>
    </div>
  </div>);
}
