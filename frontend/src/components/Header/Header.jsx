import Button from '../Button/Button.jsx';
import "./Header.css";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../AuthContext.jsx";

export default function Header() {
    const navigate = useNavigate();
    const { user, loading, refreshAuth} = useAuth()

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Logout failed");
            }
            refreshAuth();
        } catch (error) {
            console.error("Ошибка выхода:", error);
            alert("Не удалось выйти. Попробуйте ещё раз.");
        }
    };

    return (
        <header className="header">
            <div className="header-left">
                <h3 onClick={() => navigate('/')}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                >FakeForum</h3>
                <Button onClick={() => navigate('/')}>Home</Button>
                <Button onClick={() => navigate('/search')}>Search</Button>
                <Button onClick={() => navigate('/add')}>Add</Button>
            </div>
            <div className="header-right">
                {loading ? (
                    <p>Loading...</p>
                ) : user ? (
                    <>
                    <Button onClick={() => navigate('/me')}>{user.username}</Button>
                    <Button onClick={handleLogout}>Logout</Button>
                    </>
                ) : (
                    <Button onClick={() => navigate('/me')}>Login</Button>
                )}
            </div>
        </header>
    );
}