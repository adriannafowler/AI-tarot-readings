import React from "react";
import './accounts.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginBackground from "./background/loginBG.jsx";


function LogIn() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_HOST}/api/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password})
            })


        if (!response.ok) {
            const errorData = await response.json();
            throw new Error('Invalid credentials');
        }
        const data = await response.json(
        localStorage.setItem('token', data.access);
        localStorage.setItem('refresh', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/decks/')
        } catch (error) {
            console.error('Login Error:', error);
            setError('Invalid credentials')
        }
        }


    return (
        <>
        <div>
            <LoginBackground />
        </div>
        <div className="login-container">
            <form onSubmit={handleLogin}>
                <div className="text_area">
                    <input
                    type="text"
                    id="username"
                    value={username}
                    placeholder="username"
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }

                    />
                </div>
                <div className="text_area">
                    <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }

                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" className="accounts-button">LOGIN</button>
            </form>
            <p className="signup-blerb">
                Don't have an account? ✨
                <a href="/signup">Sign-up!</a>✨
            </p>
        </div>
        </>
    )
}

export default LogIn;
