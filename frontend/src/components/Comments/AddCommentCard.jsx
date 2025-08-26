import './AddCommentCard.css';
import { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';

export default function AddCommentCard({ postId, onCommentAdded }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [comment, setComment] = useState('');

    const handleAddClick = async () => {
        if (!comment.trim()) return;

        try {
            const response = await fetch(`/api/comments/${postId}/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: comment }),
                credentials: 'include'
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Failed to add comment');
            }
            await response.json();
            setComment('');
            if (onCommentAdded) onCommentAdded();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleLoginClick = () => navigate('/me');

    return (
        <div className="addcomment-prompt-container">
            <div className={`addcomment-prompt-form ${!user ? 'blurred' : ''}`}>
                <textarea
                    placeholder="Write your comment..."
                    maxLength={500}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="addcomment-input"
                />
                <small>{comment.length}/500 characters</small>
                <Button onClick={handleAddClick} disabled={!comment.trim()}>Submit</Button>
            </div>

            {!user && (
                <div className="overlay">
                    <p className="overlay-text">Log in to add a comment</p>
                    <Button onClick={handleLoginClick}>Login</Button>
                </div>
            )}
        </div>
    );
}
