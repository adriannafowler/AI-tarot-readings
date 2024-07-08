import React from "react";
import NavBar from "../nav";
import './decks.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Decks() {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [userDecks, setUserDecks] = useState([]);
    const token = localStorage.getItem('token');
    console.log("Retrieved token from localStorage:", token);



    const fetchUserInfo = async () => {
        if (!token) {
            navigate('/');
            alert('You must be logged in to access this page');
            return;
        }

        const user = localStorage.getItem('user');
        if (user) {
            setUserInfo(JSON.parse(user));
            console.log("USER INFO:", JSON.parse(user));
        } else {
            console.log("No user info found in localStorage");
        }
    };

    const fetchUserDecks = async () => {

        if (!token) {
            navigate('/');
            alert('You must be logged in to access this page');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_HOST}/api/decks/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            console.log("API Response:", response);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error Data:', errorData);
                throw new Error('Error fetching decks');
            }

            const data = await response.json();
            setUserDecks(data.decks);
            console.log("DECKS DATA:", data.decks);
        } catch (err) {
            console.error("Error during fetch:", err);
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchUserInfo();
        fetchUserDecks();
        setLoading(false);
    }, [navigate, token]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <NavBar />
            <h1>Decks List Page</h1>
            {userDecks.map((deck) => (
                <div key={deck.id}>
                    <ul>
                        <li>
                            {deck.name}
                        </li>
                    </ul>
                </div>
            ))}
        </>
    );
}

export default Decks;
