import {useRouter} from "next/router";
import {useEffect, useRef, useState} from "react";
import "./posts.css"
import Link from "next/link";
import {isTeacher} from "@/utils/auth";

interface IPost {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

export async function getServerSideProps(context) {
  const {params, query} = context;
  const recipientId = query.recipientId;

  if (!recipientId) {
    console.error('recipientId is not defined');
    return {props: {userSender: null, senderId: null}};
  }

  try {
    const response = await fetch(`http://localhost:3001/users/${recipientId}`, {
      method: 'GET', headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      const userSender = await response.json();
      return {props: {userSender, senderId: query.senderId}};
    } else {
      return {props: {userSender: null, senderId: null}};
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    return {props: {userSender: null, senderId: null}};
  }
}

export default function PostPage({userSender, senderId}) {
  const router = useRouter();
  const {recipientId} = router.query;
  const [userName, setUserName] = useState('');
  const [posts, setPosts] = useState<IPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [authors, setAuthors] = useState<{ [key: number]: string }>({});
  const postContainer = useRef<HTMLDivElement>(null);
  const [isTeacherUser, setIsTeacherUser] = useState(false);

  useEffect(() => {

    const checkIfTeacher = async () => {
      const result = await isTeacher();
      setIsTeacherUser(result);
    };

    checkIfTeacher();
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/posts');
        if (!response.ok) throw new Error('Erro ao buscar posts');
        const data = await response.json();
        setPosts(data);

        const authorIds = [...new Set(data.map(post => post.authorId))];
        const authorPromises = authorIds.map(id => fetch(`http://localhost:3001/users/${id}`).then(res => res.json()));
        const authorData = await Promise.all(authorPromises);
        const authorMap = authorData.reduce((acc, author) => {
          acc[author.id] = author.email;
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

  const handleCreate = () => {
    router.push("/create");
  }

  const handleAdmin = () => {
    router.push("/admin");
  }

  const handleLogOut = () => {
    router.push("/");
  }

  useEffect(() => {
    postContainer.current?.scrollTo(0, postContainer.current.scrollHeight);
  }, [posts]);

  return (<div className="flex flex-col items-center p-4 bg-background-900 min-h-screen">
    <h1 className="text-3xl font-bold mb-4 text-fontColor-900">Tela de Posts</h1>

    {isTeacherUser && (
      <div className="header">
        <button id="new-post" onClick={handleCreate}>Novo Post</button>
        <button id="admin" onClick={handleAdmin}>Administrador</button>
      </div>
    )}

    <form className="search-bar" onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Buscar posts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit">
        Buscar
      </button>
    </form>

    <div ref={postContainer} className="post">
      {posts.map((post) => (<div key={post.id} className="post-card p-4 mb-4">
        <Link href={`/posts/${post.id}`}>
          <h3 className="text-xl font-semibold text-fontColor-900">{post.title}</h3>
          <p className="text-gray-700">{post.content}</p>
          <p className="text-sm text-gray-500">Autor: {authors[post.authorId] || 'Desconhecido'}</p>
        </Link>
      </div>))}
    </div>
    <div>
      <button onClick={handleLogOut}>Sair</button>
    </div>
  </div>);
}
