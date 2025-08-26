import { useState } from "react";
import { useAuth } from "./AuthContext";
import Button from "./Button/Button";
import "./AddPostSection.css";
import { useNavigate } from "react-router-dom";

export default function AddPostSection({ onSuccess }) {
    const { user, refreshAuth } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const handleAddPost = async () => {
        if (!title || !description) return;
        setLoading(true);
        setError(false);

        try {
            const response = await fetch("/api/posts/add", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description }),
                credentials: "include",
            });

            const result = await response.json().catch(() => ({}));
            console.log(result.post_id)

            if (!response.ok) {
                throw new Error(result?.detail || "Failed to add post");
            }

            onSuccess?.(result);
            setTitle("");
            setDescription("");
            navigate(`/posts/${result.post_id}`)
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        window.location.href = "/me";
    };

    return (
        <section className="addpost-container">
            {!user && (
                <div className="overlay">
                    <p>You need to log in to add posts</p>
                    <Button onClick={handleLoginRedirect}>Login</Button>
                </div>
            )}


           <div className={`form ${!user ? "blurred" : ""}`}>
                {error && <p style={{ color: "#a70000ff" }}>Error while adding post</p>}
                <p>Post title</p>
                <input
                    type="text"
                    value={title}
                    maxLength={200}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={!user}
                />
                <div className="label-with-counter">
                    <p>Post content</p>
                    <span className="char-counter">{title.length}/200 characters</span>
                </div>
                <textarea
                    value={description}
                    maxLength={3000}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={!user}
                />
                <small>{description.length}/3000 characters</small>

                <Button onClick={handleAddPost} disabled={!user || loading || !description.trim() || !title.trim()}>
                    {loading ? "Adding..." : "Add Post"}
                </Button>

                <p style={{ textAlign: "center", color: "#555", marginTop: "1rem" }}>
                    Your post will be visible to everyone
                </p>
            </div>
        </section>
    );
}

