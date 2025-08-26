import { useNavigate } from "react-router-dom";
import Button from "../Button/Button"
import "./Register.css"
import { useState } from "react"

export default function Register({ onSuccess, refreshAuth }){
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("")
    const navigate = useNavigate();
    
    const handleRegister = async () => {
        const data = {
            email: email,
            username: username,
            password: password,
        };
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) {
                const message = result?.detail || "Login failed";
                throw new Error(message);
            }
            refreshAuth()
            onSuccess?.(result);
            navigate(-1);
        } catch (error) {
            setError(error.message)
        }
    }

    return(
        <section className="register-container">
            {error && <p style={{color: "#a70000ff"}}>{error}</p>}
            <p>Email</p>
            <input type="text" onChange={(e) => setEmail(e.target.value)}/>
            <p>Username</p>
            <input type="text" onChange={(e) => setUsername(e.target.value)}/>
            <p>Password</p>
            <input type="password" onChange={(e) => setPassword(e.target.value)}/>
            <Button onClick={() => handleRegister()}>Register</Button>
        </section>
    )
}