import './UserCard.css';
import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import formatDate from '../utils/formatDate';
import PostCard from '../Post/PostCard';
import BackButton from '../Button/BackButton';
import { useAuth } from '../AuthContext';
import Button from '../Button/Button';

export default function UserCard({ user: initialUser = null }) {
    const { user_id } = useParams();
    const { user: authUser } = useAuth();
    const [user, setUser] = useState(initialUser);
    const [loadingUser, setLoadingUser] = useState(!initialUser);
    const [posts, setPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const navigate = useNavigate();

    const isCurrentUser = authUser && (!user_id || parseInt(user_id) === authUser.id);
    const displayedUser = isCurrentUser ? authUser : user;

    useEffect(() => {
        if (!isCurrentUser && user_id) {
            const fetchUser = async () => {
                setLoadingUser(true);
                try {
                    const response = await fetch(`/api/users/${user_id}`);
                    if (!response.ok) throw new Error("Failed to fetch user");
                    const data = await response.json();
                    setUser(data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoadingUser(false);
                }
            };
            fetchUser();
        }
    }, [isCurrentUser, user_id]);

    const fetchPosts = useCallback(async () => {
        if (!displayedUser) return;
        setLoadingPosts(true);
        try {
            const response = await fetch(`/api/posts/${displayedUser.id}/posts`);
            if (!response.ok) throw new Error("Failed to fetch posts");
            const data = await response.json();
            setPosts(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingPosts(false);
        }
    }, [displayedUser]);

    useEffect(() => {
        if (displayedUser) fetchPosts();
    }, [displayedUser, fetchPosts]);

    if (loadingUser && !isCurrentUser) return <p>Loading user...</p>;

    return (
        <>
            <BackButton />
            <div className="user-card">
                <div className="user-card-header">
                    <span className="user-card-username">{displayedUser?.username}</span>
                    <span className="user-card-join-date">
                        Registered on: {formatDate(displayedUser?.register_date)}
                    </span>
                </div>
                <div className="user-card-body">
                    <p>
                        {displayedUser?.about || 
                        "Soon there will be information about users here. You will be able to write about yourself, provide contact information and everything else that others should know about you."}
                    </p>
                    {isCurrentUser && (
                        <>
                            <Button style={{ marginTop: "1rem", marginRight: "0.5rem" }}  onClick={() => navigate("/me/edit")}>Edit profile</Button>
                            <Button style={{ marginTop: "1rem", marginLeft: "0.5rem" }}  onClick={() => navigate("/me/password")}>Change password</Button>
                        </>
                    )}
                </div>
            </div>

            {loadingPosts && <p>Loading posts...</p>}
            {!loadingPosts && posts.map(post => <PostCard key={post.id} post={post} />)}
        </>
    );
}
