import React from "react";
import './accounts.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupBackground from "./background/signupBG.jsx";


function SignUp() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        username: '',
        password: '',
        confirm_password: '',
    })
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const handleSignUp = async (e) => {
        e.preventDefault()
        if (formData.password !== formData.confirm_password) {
            setError('Passwords do not match');
            return;
        }
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_HOST}/api/signup/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    username: formData.username,
                    password: formData.password,
                })
            })
        if (response.ok) {
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                username: '',
                password: '',
                confirm_password: '',
            })
            const userData = { email, password }
            navigate('/login/')
        } else {
            const data = await response.json();
            setError(data.detail || 'Sign-up failed');
            }
        } catch (error) {
            setError('Sign-up failed');
        }
    };
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    return (
        <>
        <div>
            <SignupBackground />
        </div>
        <div className="login-container">
            <form onSubmit={handleSignUp}>
            <div className="text_area">
                    <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    placeholder="first name"
                    className="text_input"
                    onChange={handleFormChange}
                    />
                </div>
                <div className="text_area">
                    <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    placeholder="last name"
                    className="text_input"
                    onChange={handleFormChange}
                    />
                </div>
                <div className="text_area">
                    <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    placeholder="username"
                    className="text_input"
                    onChange={handleFormChange}
                    />
                </div>
                <div className="text_area">
                    <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    placeholder="email"
                    className="text_input"
                    onChange={handleFormChange}
                    />
                </div>
                <div className="text_area">
                    <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    />
                </div>
                <div className="text_area">
                    <input
                        type="password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        placeholder="confirm password"
                        className="text_input"
                        onChange={handleFormChange}
                    />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit" className="accounts-button">SUBMIT</button>
            </form>
            <p className="signup-blerb">
                Already have an account? ✨
                <a href="/login">Log-in!</a>✨
            </p>
        </div>
        </>
    )
}

export default SignUp;
