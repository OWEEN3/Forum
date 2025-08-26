import BackButton from "./Button/BackButton";
import Button from "./Button/Button"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditPasswordSection() {
    const [oldPassword, setOldPassword] = useState("");
    const [confirmOldPassword, setConfirmOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigation = useNavigate();

    const handleSave = async () => {
        setError("");
        setSuccess("");

        if (oldPassword !== confirmOldPassword) {
            setError("Current password and confirmation do not match");
            return;
        }

        try {
            const response = await fetch("/api/users/edit/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    old_password: oldPassword,
                    new_password: newPassword
                })
            });

            const result = await response.json();

            if (!response.ok) throw new Error(result.detail || "Failed to update password");

            setSuccess("Password updated successfully!");
            navigation("/me")
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
            <BackButton />
            <section className="edit-profile-container">
                <div className="label-with-counter">
                    <p>Current password</p>
                </div>
                <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />

                <div className="label-with-counter">
                    <p>Confirm current password</p>
                </div>
                <input
                    type="password"
                    value={confirmOldPassword}
                    onChange={(e) => setConfirmOldPassword(e.target.value)}
                />

                <div className="label-with-counter">
                    <p>New password</p>
                </div>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                {error && <span className="edit-profile-error">{error}</span>}
                {success && <span className="edit-profile-success">{success}</span>}

                <Button className="comment-card-btn" onClick={handleSave}>
                    Save
                </Button>
            </section>
        </>
    );
}
