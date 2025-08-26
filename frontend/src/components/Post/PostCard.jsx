import './PostCard.css';
import { useNavigate } from 'react-router-dom';
import formatDate from '../utils/formatDate';
import CommentCard from '../Comments/CommentCard';

export default function PostCard({ post }) {
    const navigate = useNavigate();
    
    return (
        <div
            className="post-card"
            onClick={() => navigate(`/posts/${post.id}`)}
            style={{ cursor: 'pointer', position: 'relative' }}
        >
            <div className="post-card-date">{formatDate(post.created_at)}</div>
            <h2 className="post-card-title">{post.title}</h2>
            <p className="post-card-body">{post.description}</p>
        </div>
    );
}