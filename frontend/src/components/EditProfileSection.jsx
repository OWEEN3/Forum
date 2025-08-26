import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./Button/BackButton";
import Button from "./Button/Button";
import "./EditProfileSection.css";
import { useAuth } from "./AuthContext";

export default function EditProfile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { user, refreshAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setAbout(user.about || "");
    }
  }, [user]);

  const handleSave = async () => {
    try {
      const response = await fetch("/api/users/edit/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, about }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to update profile");
      }

      await refreshAuth();
      setSuccess("Profile updated successfully");
      navigate(`/me`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <>
      <BackButton />
      <section className="edit-profile-container">
        {error && <p className="edit-profile-error">{error}</p>}
        {success && <p className="edit-profile-success">{success}</p>}

        <div className="label-with-counter">
          <p>Username</p>
          <span className="char-counter">{username.length}/100</span>
        </div>
        <input
          type="text"
          maxLength={100}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <p>Email</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="label-with-counter">
          <p>About</p>
          <span className="char-counter">{about.length}/500</span>
        </div>
        <textarea
          maxLength={500}
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        />
        <Button onClick={handleSave}>Save</Button>
      </section>
    </>
  );
}
