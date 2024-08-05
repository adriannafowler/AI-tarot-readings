import React from "react";
import NavBar from "../nav";
import "./decks.css";
import editIcon from "../assets/edit_icon.svg";
import Tooltip from "../assets/tooltip.jsx";
import DecksBackground from "./background/decksBG.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function DeckDetail() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [userDecks, setUserDecks] = useState([]);
    const [cards, setCards] = useState([]);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [deckName, setDeckName] = useState("");
    const token = localStorage.getItem("token");
    const param = useParams();
    const deckID = param.id;

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

    const fetchCards = async () => {
        if (!token) {
        navigate("/");
        alert("You must be logged in to access this page");
        return;
        }

        try {
        const response = await fetch(
            `${import.meta.env.VITE_APP_API_HOST}/api/decks/${deckID}/cards/`,
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
            throw new Error("Error fetching cards");
        }

        const data = await response.json();
        setCards(data.cards.sort());
        } catch (err) {
        console.error("Error during fetch:", err);
        setError(err.message);
        }
    };

    useEffect(() => {
        fetchCards();
        setLoading(false);
        fetchUserDecks();
    }, [navigate, token]);

    useEffect(() => {
        const matchingDeck = userDecks.find(
        (deck) => Number(deck.id) === Number(deckID)
        );
        if (matchingDeck) {
        setDeckName(matchingDeck.name);
        }
    }, [userDecks, deckID]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
        <DecksBackground />
        <NavBar />
        <div className="table-top">
            <h1 className="cards-table-title">{deckName}</h1>
            <div className="tooltip-container">
            <Tooltip content="Edit">
                <img
                className="edit-icon"
                src={editIcon}
                alt="edit"
                onClick={() => navigate(`/decks/${deckID}/edit/`)}
                />
            </Tooltip>
            </div>
        </div>
        <div className="table-container">
            <table className="table" id="card-table">
            <thead className="thead-dark" id="table-head">
                <tr className="tr">
                <th scope="col">Card</th>
                <th scope="col">Description</th>
                <th scope="col">Is Negative?</th>
                </tr>
            </thead>
            <tbody>
                {cards.map((card, index) => (
                <tr
                    key={card.id}
                    className={`hover-row ${
                    hoveredRow === index ? "expanded" : ""
                    }`}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                >
                    <td>
                    <div className="card-column">
                        <img
                        src={card.image_url}
                        alt={card.name}
                        className="card-image"
                        />
                        <p className="card-name">{card.name}</p>
                    </div>
                    </td>
                    <td
                    className={`card-description ${
                        hoveredRow === index ? "full" : ""
                    }`}
                    >
                    {card.description}
                    </td>
                    <td>{card.is_negative ? "Yes" : "No"}</td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </>
    );
}

export default DeckDetail;
