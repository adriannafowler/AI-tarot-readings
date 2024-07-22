import React from "react";
import NavBar from "../nav";
import './decks.css';
import add_icon from '../assets/add.png'
import delete_icon from '../assets/delete.png'
import DeleteModal from "./delete_modal.jsx";
import Tooltip from '../assets/tooltip2.jsx'
import DecksBackground from './background/decksBG.jsx';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function DeckEdit() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [userDeck, setUserDeck] = useState({});
    const [cards, setCards] = useState([]);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [deckFormData, setDeckFormData] = useState({
        name: '',
        exclude_negative: true,
        img_url: '',
    })
    const [cardFormData, setCardFormData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [cardToDelete, setCardToDelete] = useState(null);
    const token = localStorage.getItem('token');
    const param = useParams()
    const deckID = param.id



    const fetchUserDeck = async () => {
        if (!token) {
            navigate('/');
            alert('You must be logged in to access this page');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_HOST}/api/decks/${deckID}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });


            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error Data:', errorData);
                throw new Error('Error fetching decks');
            }

            const data = await response.json();
            console.log("!!!!!!!!!!")
            setUserDeck(data.deck);
            setDeckFormData({
                name: data.deck.name,
                exclude_negative: data.deck.exclude_negative,
                img_url: data.deck.img_url
            })
        } catch (err) {
            console.error("Error during fetch:", err);
            setError(err.message);
        }
    };

    const fetchCards = async () => {
        if (!token) {
            navigate('/');
            alert('You must be logged in to access this page');
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_HOST}/api/decks/${deckID}/cards/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });


            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error Data:', errorData);
                throw new Error('Error fetching cards');
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
        fetchUserDeck();
        console.log("***********")
    }, [navigate, token]);

    useEffect(() => {
        console.log("CARDS STATE:", cards)
    }, [cards]);


    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleSave = (index, updatedCard) => {
        const updatedCards = [...cards];
        updatedCards[index] = updatedCard;
        setCards(updatedCards);
        setHoveredRow(null);
    };

    const handleChange = (e) => {
        setDeckFormData({ ...deckFormData, [e.target.name]: e.target.value });
    }

    const handleCardChange = (e, cardID) => {
        const { name, value, checked, type } = e.target;
        const newCardData = { ...cards.find(card => card.id === cardID), [name]: type === 'checkbox' ? checked : value };

        setCards(cards.map(card => card.id === cardID ? newCardData : card));

        setCardFormData(prev => {
            const cardIndex = prev.findIndex(card => card.id === cardID);
            if (cardIndex !== -1) {
                const updatedCards = [...prev];
                updatedCards[cardIndex] = newCardData;
                return updatedCards;
            }
            return [...prev, newCardData];
        });
    };

    const handleDeleteCard = (cardId) => {
        setCards(cards.filter(card => card.id !== cardId));
        setModalVisible(false);
    };

    const openDeleteModal = (card) => {
        setCardToDelete(card);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };


    return (
        <>
            <DecksBackground />
            <NavBar />
            <div className="top-container">
                <form className='deck-form-container'>
                    <div data-mdb-input-init className="form-outline mb4">
                        <label
                            className='form-label'
                            htmlFor="form1Example">
                            Deck Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={deckFormData.name}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div data-mdb-input-init className="form-outline mb-4">
                        <label
                            className='form-label'
                            htmlFor="form1Example">
                            Image URL
                        </label>
                        <input
                            type="url"
                            name="img_url"
                            value={deckFormData.img_url}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div data-mdb-input-init className='form-check'>
                        <input
                            type="checkbox"
                            name="exclude_negative"
                            defaultChecked={deckFormData.exclude_negative}
                            onChange={handleChange}
                            className="form-check-input"
                        />
                        <label
                            className='form-check-label'
                            htmlFor="form1Example">
                            Exclude negative cards from readings
                        </label>
                    </div>
                </form>
                <div className='save-button-container'>
                        <button className='save-button'>Save</button>
                        <div className="tooltip-container">
                            <Tooltip content="Add a card" >
                                <img
                                    className='add_icon'
                                    src={add_icon}
                                    alt='add a card'/>
                            </Tooltip>
                        </div>
                </div>
            </div>


            <div className='table-container'>
                <table className="table" id='card-table' >
                    <thead className="thead-dark" id='table-head'>
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
                                className={`hover-row ${hoveredRow === index ? 'expanded' : ''}`}
                                id="hover-row"
                                onMouseEnter={() => setHoveredRow(index)}
                                onMouseLeave={() => setHoveredRow(null)}>
                                    <td className="card-image-container">
                                        <div className="col">
                                            <img src={card.image_url} alt={card.name} className="card-image" />
                                            <label
                                                className='form-label'>
                                                Image URL:
                                            </label>
                                            <input
                                                type="text"
                                                name="image_url"
                                                value={card.image_url}
                                                onChange={(e) => handleCardChange(e, card.id)}
                                                className="card-input"
                                            />
                                            <label
                                                className='form-label'>
                                                Card Name:
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={card.name}
                                                onChange={(e) => handleCardChange(e, card.id)}
                                                className="card-input"
                                            />
                                        </div>
                                    </td>
                                    <td className={`card-description ${hoveredRow === index ? 'full' : ''}`}>
                                        <textarea type="text-area"
                                            name="description"
                                            value={card.description}
                                            onChange={(e) => handleCardChange(e, card.id)}
                                            className="card-description"
                                            rows="10">
                                        {card.description}
                                        </textarea>
                                    </td>
                                    <td>
                                        <div data-mdb-input-init className='form-check'>
                                            <input
                                                type="checkbox"
                                                name="exclude_negative"
                                                defaultChecked={card.is_negative}
                                                onChange={(e) => handleCardChange(e, card.id)}
                                                className="form-check-input"
                                            />
                                            <label
                                                className='form-check-label'
                                                htmlFor="form1Example">
                                                Card is negative
                                            </label>
                                        </div>
                                        <img className='delete_icon' src={delete_icon} alt="delete a card" onClick={() => openDeleteModal(card)} />
                                    </td>
                            </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {modalVisible && (
                < DeleteModal
                cardTitle={cardToDelete?.name}
                onDelete={() => handleDeleteCard(cardToDelete.id)}
                onCancel={closeModal}
                imgURL={cardToDelete?.image_url}
                />
            )}
        </>
    );
}

export default DeckEdit;
