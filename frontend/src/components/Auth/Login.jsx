import Button from "../Button/Button"
import "./Login.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom";

export default function Login({ onSuccess, refreshAuth }){
    const [password, setPassword] = useState("");
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        const data = {
            username_or_email: emailOrUsername,
            password: password,
        };
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include"
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                const message = result?.detail || "Login failed";
                throw new Error(message);
            }
            refreshAuth();
            onSuccess?.(result);
            navigate(-1);
        } catch (error) {
            setError(true);
        }
    };

    return(
        <section className="login-container">
            {error && <p style={{color: "#a70000ff"}}>Uncorrect credentials</p>}
            <p>Email or username</p>
            <input type="text" onChange={(e) => setEmailOrUsername(e.target.value)}/>
            <p>Password</p>
            <input type="password" onChange={(e) => setPassword(e.target.value)}/>
            <Button onClick={handleLogin}>Login</Button>
        </section>
    );
}