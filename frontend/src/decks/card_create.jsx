import React from "react";
import { useState, useRef } from "react";

function CreateCard({ deckID, token, onNewCardAdded, newCards, setNewCards }) {
    const [hoveredRow, setHoveredRow] = useState(null);
    const tableRef = useRef(null);

    const handleCardChange = (e, cardID) => {
        const { name, value, checked } = e.target;
        const updatedValue = name === "is_negative" ? checked : value;

        setNewCards((prev) =>
        prev.map((card) =>
            card.id === cardID ? { ...card, [name]: updatedValue } : card
        )
        );
    };

    return (
        <>
        {newCards.map((card) => (
            <tr
            key={card.id}
            className={`hover-row ${hoveredRow === card.id ? "expanded" : ""}`}
            id="hover-row"
            onMouseEnter={() => setHoveredRow(card.id)}
            onMouseLeave={() => setHoveredRow(null)}
            style={{ position: "relative" }}
            >
            <td className="card-image-container">
                <div className="col">
                <div>
                    <img
                    src={card.image_url}
                    alt={card.name}
                    className="card-image"
                    />
                </div>
                <label className="form-label" id="img-url-label">
                    Image URL:
                </label>
                <input
                    type="text"
                    name="image_url"
                    value={card.image_url}
                    onChange={(e) => handleCardChange(e, card.id)}
                    className="card-input"
                />
                <label className="form-label">Card Name:</label>
                <input
                    type="text"
                    name="name"
                    value={card.name}
                    onChange={(e) => handleCardChange(e, card.id)}
                    className="card-input"
                />
                </div>
            </td>
            <td
                className={`card-description ${
                hoveredRow === card.id ? "full" : ""
                }`}
            >
                <textarea
                name="description"
                value={card.description}
                onChange={(e) => handleCardChange(e, card.id)}
                className="card-description"
                rows="10"
                ></textarea>
            </td>
            <td>
                <div data-mdb-input-init className="form-check">
                <input
                    type="checkbox"
                    name="is_negative"
                    checked={card.is_negative}
                    onChange={(e) => handleCardChange(e, card.id)}
                    className="form-check-input"
                />
                <label className="form-check-label">Card is negative</label>
                </div>
            </td>
            <td>
                <div>
                <button
                    className="cancel-button"
                    onClick={() =>
                    setNewCards((prev) => prev.filter((c) => c.id !== card.id))
                    }
                >
                    cancel
                </button>
                </div>
            </td>
            </tr>
        ))}
        </>
    );
}

export default CreateCard;
