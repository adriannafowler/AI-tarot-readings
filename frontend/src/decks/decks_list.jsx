import React from "react";
import NavBar from "../nav";
import "./decks.css";
import DecksBackground from "./background/decksBG.jsx";
import sparkles from "./background/sparkles.gif";
import add_icon from "../assets/add.png";
import Tooltip from "../assets/tooltip2.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Decks() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();
    const [userDecks, setUserDecks] = useState([]);
    const token = localStorage.getItem("token");

    const fetchUserDecks = async () => {
        if (!token) {
        navigate("/");
        alert("You must be logged in to access this page");
        return;
        }

        try {
        const response = await fetch(
            `${import.meta.env.VITE_APP_API_HOST}/api/decks/`,
            {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            credentials: "include",
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error Data:", errorData);
            throw new Error("Error fetching decks");
        }

        const data = await response.json();
        setUserDecks(data.decks);
        } catch (err) {
        console.error("Error during fetch:", err);
        setError(err.message);
        }
    };

    useEffect(() => {
        fetchUserDecks();
        setLoading(false);
    }, [navigate, token]);

    const handleMouseEnter = (index) => {
        setHoveredCard(index);
    };

    const handleMouseLeave = () => {
        setHoveredCard(null);
    };

    const handleMouseMove = (event) => {
        setMousePosition({ x: event.clientX, y: event.clientY });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
        <DecksBackground />
        <NavBar />
        <div className="title-add-container">
            <h1 className="decks-list-title">Decks</h1>
            <div className="tooltip-container">
                <Tooltip content="Add a deck">
                <img
                    className="add_icon"
                    src={add_icon}
                    alt="add a card"
                    onClick={() => navigate('/decks/create/')}
                />
                </Tooltip>
            </div>
        </div>
        <div className="flex-grid-container">
            <div className="flex-grid">
            {userDecks.map((deck, index) => (
                <div
                className="col"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
                key={deck.id}
                >
                <div
                    className="card"
                    id="card"
                    onClick={() => navigate(`/decks/${deck.id}/`)}
                >
                    <img
                    className="card-img-top"
                    id="card-img"
                    src={deck.img_url}
                    alt={deck.name}
                    />
                    {hoveredCard === index && (
                    <img className="card-gif" src={sparkles} alt="GIF" />
                    )}
                    <div className="card-block">
                    <h5 className="card-title">{deck.name}</h5>
                    <p className="card-text">{deck.description}</p>
                    </div>
                </div>
                </div>
            ))}
            </div>
        </div>
        </>
    );
}

export default Decks;
