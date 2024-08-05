import React from "react";
import NavBar from "../nav";
import "./decks.css";
import save_button from "../assets/save.svg";
import cancel_button from "../assets/cancel.svg";
import DecksBackground from "./background/decksBG.jsx";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function DeckCreate() {
    const navigate = useNavigate();
    const [deckFormData, setDeckFormData] = useState({
        name: "",
        exclude_negative: true,
        img_url: "",
    });
    const token = localStorage.getItem("token");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setDeckFormData((prevState) => ({
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const deckResponse = await fetch(
            `${import.meta.env.VITE_APP_API_HOST}/api/decks/`,
            {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(deckFormData),
            credentials: "include",
            }
        );

        if (!deckResponse.ok) {
            const errorData = await deckResponse.json();
            console.error("Error Data:", errorData);
            throw new Error("Error creating deck");
        }
        const deckData = await deckResponse.json();
        const newDeckID = deckData.id;
        navigate(`/decks/${newDeckID}/edit/`);
        } catch (err) {
        console.error("Error during deck POST:", err);
        }
    };

    const backToDecksList = () => {
        navigate("/decks/");
    };

    return (
        <>
        <DecksBackground />
        <NavBar />
        <div className="top-container">
            <form className="create-deck-form-container" onSubmit={handleSubmit}>
            <div className="form-outline mb4">
                <label className="form-label" htmlFor="deckName">
                Deck Name
                </label>
                <input
                type="text"
                id="deckName"
                name="name"
                value={deckFormData.name}
                onChange={handleChange}
                className="form-control"
                />
            </div>
            <div className="form-outline mb-4">
                <label className="form-label" htmlFor="imageURL">
                Image URL
                </label>
                <input
                type="url"
                id="imageURL"
                name="img_url"
                value={deckFormData.img_url}
                onChange={handleChange}
                className="form-control"
                />
            </div>
            <div className="form-check">
                <input
                type="checkbox"
                id="excludeNegative"
                name="exclude_negative"
                checked={deckFormData.exclude_negative}
                onChange={handleChange}
                className="form-check-input"
                />
                <label className="form-check-label" htmlFor="excludeNegative">
                Exclude negative cards from readings
                </label>
            </div>
            <div className="create-buttons-container">
                <button type="submit" id="create_save_button" className="col">
                <img className="edit_buttons" src={save_button} alt="Save" />
                </button>
                <button
                type="button"
                id="cancel_button"
                className="col"
                onClick={backToDecksList}
                >
                <img className="edit_buttons" src={cancel_button} alt="Cancel" />
                </button>
            </div>
            </form>
        </div>
        </>
    );
}

export default DeckCreate;
