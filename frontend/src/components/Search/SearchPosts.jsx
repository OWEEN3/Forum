import {useState, useEffect, useCallback, useRef} from 'react';
import PostCard from '../Post/PostCard';
import './SearchPosts.css';
import Button from '../Button/Button.jsx';

export default function Search() {
  const [text, editText] = useState('');
  const [searching, editSearchingState] = useState(false)
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const textRef = useRef(text);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const response = await fetch(
      `/api/posts/search?title=${textRef.current}`
    );
    const data = await response.json();
    setPosts(data);
    setLoading(false);
  }, []);

  const handleSearch = () => {
    editSearchingState(true);
    fetchPosts();
  };

  const handleBack = () => {
    editSearchingState(false);
  };

  return (
    <>
      {!searching && (
        <section className="search-section-container">
          <h1 className="search-section-title">Enter title post:</h1>
          <input
            className="search-section-input"
            value={text}
            onChange={event => editText(event.target.value)}
            type="text"
            placeholder="Search by title"
          />
          <Button onClick={() => handleSearch()}>
            Search
          </Button>
        </section>
      )}
      {searching && (
        <>
        <section className="search-section-container">
          <h1 className="search-section-title">Result: {text}</h1>
          <Button onClick={() => handleBack()}>
            Back
          </Button>
          <div className="search-section-results">
            {loading && <p>Loading...</p>}
            {!loading && posts.length === 0 && <p>Posts not found</p>}
          </div>
        </section>
          {!loading && posts.length > 0 && (
              posts.map(post => (
                <div key={post.id}>
                  <PostCard post={post} />
                </div>
              ))
            )}
        </>
      )}
    </>
  );
}