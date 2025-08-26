import './AddPostCard.css';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';

export default function AddPostPrompt() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleAddClick = () => navigate('/add');
    const handleLoginClick = () => navigate('/me');

    return (
        <div className="addpost-prompt-container">
            <div className={`addpost-prompt-form ${!user ? 'blurred' : ''}`}>
                <p className="addpost-prompt-text">Click the button to add a new post</p>
                <Button onClick={handleAddClick}>Add Post</Button>
            </div>
            {!user && (
                <div className="overlay">
                    <p className="overlay-text">Log in to add a post</p>
                    <Button onClick={handleLoginClick}>Login</Button>
                </div>
            )}
        </div>
    );
}
