import { useState } from "react"
import Button from "./Button/Button"
import Login from "./Auth/Login"
import Register from "./Auth/Register"
import "./AuthSection.css"
import { useAuth } from "./AuthContext";
import UserCard from "./User/UserCard"

export default function AuthSection(){
    const [authSection, editAuthSection] = useState("login")
    const { user, loading, refreshAuth} = useAuth()
    return(
        <>
        {loading && <p>Loading...</p>}
        {!user && 
            <section className="auth-section-container">
                <div className="auth-section-buttons">
                    <Button isActive={authSection==="login"} onClick={() => editAuthSection("login")}>Login</Button>
                    <Button isActive={authSection==="register"} onClick={() => editAuthSection("register")}>Register</Button>
                </div>
                {authSection === "login" && <Login refreshAuth={refreshAuth} onSuccess={() => console.log("Logged in")} />}
                {authSection === "register" && <Register refreshAuth={refreshAuth} onSuccess={() => console.log("Registered")} />}
            </section>
        }
        {user && 
            <section>
                <UserCard user={user} />
            </section>
        }
        </>
    )
}