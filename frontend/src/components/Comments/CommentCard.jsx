import './CommentCard.css';
import { useAuth } from '../AuthContext';
import { useState } from 'react';
import formatDate from '../utils/formatDate';

export default function CommentCard({ comment, onUpdate }) {
    const { user } = useAuth();
    const isCurrentUser = user && user.id === comment.creator_id;

    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleSave = async () => {
        if (!editContent.trim()) return;
        try {
            const response = await fetch(`/api/comments/edit/${comment.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: editContent }),
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to edit comment');
            await response.json();
            setIsEditing(false);
            onUpdate();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`/api/comments/delete/${comment.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to delete comment');
            await response.json();
            setConfirmDelete(false);
            onUpdate();
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    return (
        <div className="comment-card">
            <div className="comment-card-header">
                <span className="comment-card-author">{comment.username || 'Anonymous'}</span>
                <span className="comment-card-date">{formatDate(comment.created_at)}</span>
            </div>

            {isEditing ? (
                <div className="comment-card-edit">
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        maxLength={500}
                        className="comment-card-input"
                    />
                    <div className="comment-card-edit-actions">
                        <button className="comment-card-btn" onClick={handleSave}>Save</button>
                        <button className="comment-card-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </div>
            ) : (
                <p className="comment-card-body">{comment.content}</p>
            )}

            {isCurrentUser && !isEditing && !confirmDelete && (
                <div className="comment-card-user-actions">
                    <button className="comment-card-btn" onClick={() => setIsEditing(true)}>Edit</button>
                    <button className="comment-card-btn" onClick={() => setConfirmDelete(true)}>Delete</button>
                </div>
            )}

            {confirmDelete && (
                <div className="comment-card-delete-confirm">
                    <span className="comment-card-body">Are you sure?</span>
                    <div className="comment-card-delete-actions">
                        <button className="comment-card-btn" onClick={handleDelete}>Yes</button>
                        <button className="comment-card-btn" onClick={() => setConfirmDelete(false)}>No</button>
                    </div>
                </div>
            )}
        </div>
    );
}
