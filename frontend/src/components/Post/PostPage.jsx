import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import './PostPage.css';
import formatDate from '../utils/formatDate';
import BackButton from '../Button/BackButton';
import CommentCard from '../Comments/CommentCard';
import AddCommentCard from '../Comments/AddCommentCard';
import { useAuth } from '../AuthContext';

export default function PostPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loadingPost, setLoadingPost] = useState(true);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(false);

    const { user } = useAuth();
    const isCurrentUser = user && post && user.id === post.creator;

    const navigate = useNavigate();

    useEffect(() => {
        async function fetchPost() {
            setLoadingPost(true);
            const response = await fetch(`/api/posts/${id}`);
            const data = await response.json();
            setPost(data);
            setEditTitle(data.title);
            setEditDescription(data.description);
            setLoadingPost(false);
        }
        fetchPost();
    }, [id]);

    const fetchComments = useCallback(async () => {
        if (!post) return;
        setLoadingComments(true);
        try {
            const response = await fetch(`/api/comments/${post.id}`);
            const data = await response.json();
            setComments(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingComments(false);
        }
    }, [post]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSave = async () => {
        try {
            const response = await fetch(`/api/posts/${post.id}/edit`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    title: editTitle,
                    description: editDescription
                })
            });
            if (!response.ok) throw new Error('Failed to edit post');

            const data = await response.json();
            setPost(data.post);
            setIsEditing(false);
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/posts/${post.id}/delete`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to delete post');
            await response.json();
            navigate('/');
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    if (loadingPost) return <section><p>Loading...</p></section>;
    if (!post) return <section><p>Post not found</p></section>;

    return (
        <>
            <BackButton />
            <div className="post-page-container">
                <div className="post-page-header">
                    <div className="post-page-title-block">
                        {isEditing ? (
                            <input
                                className="post-page-input"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                            />
                        ) : (
                            <h3 className="post-page-title">{post.title}</h3>
                        )}
                        <span
                            className="post-page-username"
                            onClick={() => navigate(`/${post.creator}`)}
                            style={{ cursor: "pointer", color: "#0073e6" }}
                        >
                            {post.username}
                        </span>
                    </div>
                    <span className="post-page-date">{formatDate(post.created_at)}</span>
                </div>

                {isEditing ? (
                    <textarea
                        className="post-page-input"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                    />
                ) : (
                    <div className="post-page-body">{post.description}</div>
                )}

                <div className="post-page-updated">
                    Last update: {formatDate(post.updated_at)}
                </div>

                {isCurrentUser && !isEditing && !confirmDelete && (
                    <div className="post-page-actions">
                        <button className="comment-card-btn" onClick={() => setIsEditing(true)}>Edit</button>
                        <button className="comment-card-btn" onClick={() => setConfirmDelete(true)}>Delete</button>
                    </div>
                )}

                {isEditing && (
                    <div className="post-page-actions">
                        <button className="comment-card-btn" onClick={handleSave}>Save</button>
                        <button className="comment-card-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                )}

                {confirmDelete && (
                    <div className="post-page-actions">
                        <span className="post-page-confirm">Are you sure?</span>
                        <button className="comment-card-btn" onClick={handleDelete}>Yes</button>
                        <button className="comment-card-btn" onClick={() => setConfirmDelete(false)}>No</button>
                    </div>
                )}
            </div>

            {loadingComments && <p>Loading...</p>}
            {!loadingComments && comments.map(comment => (
                <CommentCard 
                    key={comment.id} 
                    comment={comment} 
                    onUpdate={fetchComments}
                />
            ))}
            {!loadingComments && <AddCommentCard postId={post.id} onCommentAdded={fetchComments}/>}
        </>
    );
}
