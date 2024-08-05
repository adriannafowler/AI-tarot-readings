import React from "react";
import delete_icon from '../assets/delete.png'
import { useState, useEffect, useRef } from 'react';

function CreateCard({ deckID, token, onNewCardAdded, newCards, setNewCards }) {
    const [hoveredRow, setHoveredRow] = useState(null);
    const tableRef = useRef(null);

    const handleSubmit = async () => {
        try {

            if (newCards.length > 0) {
                try {
                    const cardPostPromises = newCards.map(async (card) => {
                        const cardResponse = await fetch(`${import.meta.env.VITE_APP_API_HOST}/api/decks/${deckID}/cards/`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(card),
                            credentials: 'include'
                        });


                        if (!cardResponse.ok) {
                            const errorData = await cardResponse.json();
                            console.error('Error Data:', errorData);
                            throw new Error('Error creating card');
                        }
                    });

                    await Promise.all(cardPostPromises);
                    setNewCards([]);
                    onNewCardAdded();
                } catch (err) {
                    console.error("Error during new card POST:", err);
                    setError(err.message);
                }
            }

        } catch (err) {
            console.error("Error during submit:", err);
            setError(err.message);
        }
    };

    const addNewCard = () => {
        setNewCards(prev => [
            {
                deck: deckID,
                description: '',
                image_url: '',
                is_negative: false,
                name: '',
                id: `new-${prev.length}` // unique temporary ID for each new card
            },
            ...prev
        ]);
        scrollToTop()
    };

    const scrollToTop = () => {
        if (tableRef.current) {
            tableRef.current.scrollTop = 0;
        }
    };


    const handleCardChange = (e, cardID) => {
        const { name, value, checked } = e.target;
        const updatedValue = name === 'is_negative' ? checked : value;

        setNewCards(prev => prev.map(card => card.id === cardID ? { ...card, [name]: updatedValue } : card));
    };


    return (
        <>
            {newCards.map((card, index) => (
                <tr
                    key={card.id}
                    className={`hover-row ${hoveredRow === card.id ? 'expanded' : ''}`}
                    id="hover-row"
                    onMouseEnter={() => setHoveredRow(card.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{ position: 'relative' }}>
                    <td className="card-image-container">
                        <div className="col">
                            <div>
                                <img src={card.image_url} alt={card.name} className="card-image" />
                            </div>
                            <label className='form-label' id='img-url-label'>Image URL:</label>
                            <input
                                type="text"
                                name="image_url"
                                value={card.image_url}
                                onChange={(e) => handleCardChange(e, card.id)}
                                className="card-input"
                            />
                            <label className='form-label'>Card Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={card.name}
                                onChange={(e) => handleCardChange(e, card.id)}
                                className="card-input"
                            />
                        </div>
                    </td>
                    <td className={`card-description ${hoveredRow === card.id ? 'full' : ''}`}>
                        <textarea
                            name="description"
                            value={card.description}
                            onChange={(e) => handleCardChange(e, card.id)}
                            className="card-description"
                            rows="10">
                        </textarea>
                    </td>
                    <td>
                        <div data-mdb-input-init className='form-check'>
                            <input
                                type="checkbox"
                                name="is_negative"
                                checked={card.is_negative}
                                onChange={(e) => handleCardChange(e, card.id)}
                                className="form-check-input"
                            />
                            <label className='form-check-label'>
                                Card is negative
                            </label>
                        </div>
                    </td>
                    <td>
                        <div>
                            <button className="cancel-button" onClick={() => setNewCards(prev => prev.filter(c => c.id !== card.id))}>cancel</button>
                        </div>
                    </td>
                </tr>
            ))}
        </>
    );
}

export default CreateCard;
