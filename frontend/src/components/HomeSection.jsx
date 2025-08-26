import {useState, useCallback, useEffect} from 'react';
import PostCard from './Post/PostCard.jsx';
import AddPostCard from './Post/AddPostCard.jsx';

export default function HomeSection(){
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

    const fetchPosts = useCallback(async () =>{
        setLoading(true);
        const response = await fetch("/api/posts/")
        const posts = await response.json();
        setPosts(posts);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <section>
            <AddPostCard />
            {loading && <p>Loading...</p>}
            {!loading && posts.map(post => <PostCard key={post.id} post={post}/>)}
        </section>
    )
}