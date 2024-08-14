import React from "react";
import NavBar from "../nav";
import "./decks.css";
import save_button from "../assets/save.svg";
import delete_deck_button from "../assets/delete_deck.svg";
import add_icon from "../assets/add.png";
import delete_icon from "../assets/delete.png";
import DeleteModal from "./delete_card_modal.jsx";
import Tooltip from "../assets/tooltip2.jsx";
import CreateCard from "./card_create.jsx";
import DecksBackground from "./background/decksBG.jsx";
import DeleteDeckModal from "./delete_deck_modal.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

function DeckEdit() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [userDeck, setUserDeck] = useState({});
    const [cards, setCards] = useState([]);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [deckModalVisible, setDeckModalVisible] = useState(false);
    const [cardToDelete, setCardToDelete] = useState(null);
    const [updateCards, setUpdateCards] = useState([]);
    const [newCards, setNewCards] = useState([]);
    const tableRef = useRef(null);

    const token = localStorage.getItem("token");
    const param = useParams();
    const deckID = param.id;

    const [deckFormData, setDeckFormData] = useState({
        name: "",
        exclude_negative: true,
        img_url: "",
    });

    const fetchUserDeck = async () => {
        if (!token) {
        navigate("/");
        alert("You must be logged in to access this page");
        return;
        }

        try {
        const response = await fetch(
            `${import.meta.env.VITE_APP_API_HOST}/api/decks/${deckID}/`,
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
        setUserDeck(data.deck);
        setDeckFormData({
            name: data.deck.name,
            exclude_negative: data.deck.exclude_negative,
            img_url: data.deck.img_url,
        });
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
        fetchUserDeck();
    }, [navigate, token]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleChange = (e) => {
        setDeckFormData({ ...deckFormData, [e.target.name]: e.target.value });
    };

    const handleCardChange = (e, cardID) => {
        const { name, value, type, checked } = e.target;

        const updateCardData = {
        ...cards.find((card) => card.id === cardID),
        [name]: type === "checkbox" ? checked : value,
        };

        setCards(cards.map((card) => (card.id === cardID ? updateCardData : card)));

        setUpdateCards((prev) => {
        const cardIndex = prev.findIndex((card) => card.id === cardID);
        if (cardIndex !== -1) {
            const updatedCards = [...prev];
            updatedCards[cardIndex] = updateCardData;
            return updatedCards;
        }
        return [...prev, updateCardData];
        });
    };

    const handleDeleteCard = (cardID) => {
        setCards((prevCards) => prevCards.filter((card) => card.id !== cardID));
      };

    const openDeckDeleteModal = () => {
        setDeckModalVisible(true);
    };

    const openCardDeleteModal = (card) => {
        setCardToDelete(card);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const closeDeckModal = () => {
        setDeckModalVisible(false);
    };

    const handleSubmit = async () => {
        try {
        if (deckFormData) {
            try {
            const deckResponse = await fetch(
                `${import.meta.env.VITE_APP_API_HOST}/api/decks/${deckID}/`,
                {
                method: "PUT",
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
                throw new Error("Error editing deck");
            }
            } catch (err) {
            console.error("Error during deck PUT:", err);
            setError(err.message);
            }
        }

        if (newCards.length > 0) {
            try {
            const cardPostPromises = newCards.map(async (card) => {
                const cardResponse = await fetch(
                `${import.meta.env.VITE_APP_API_HOST}/api/decks/${deckID}/cards/`,
                {
                    method: "POST",
                    headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(card),
                    credentials: "include",
                }
                );

                if (!cardResponse.ok) {
                const errorData = await cardResponse.json();
                console.error("Error Data:", errorData);
                throw new Error("Error creating card");
                }
            });

            await Promise.all(cardPostPromises);
            } catch (err) {
            console.error("Error during new card POST:", err);
            setError(err.message);
            }
        }

        if (updateCards.length > 0) {
            try {
            const cardUpdatePromises = updateCards.map(async (card) => {
                const cardResponse = await fetch(
                `${import.meta.env.VITE_APP_API_HOST}/api/decks/${deckID}/cards/${
                    card.id
                }/`,
                {
                    method: "PUT",
                    headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(card),
                    credentials: "include",
                }
                );

                if (!cardResponse.ok) {
                const errorData = await cardResponse.json();
                console.error("Error Data:", errorData);
                throw new Error(`Error updating ${card.name} card`);
                }
            });

            await Promise.all(cardUpdatePromises);
            } catch (err) {
            console.error("Error during card PUT:", err);
            setError(err.message);
            }
        }

        navigate(`/decks/${deckID}/`);
        } catch (err) {
        console.error("Error during submit:", err);
        setError(err.message);
        }
    };

    const handleNewCardAdded = () => {
        fetchCards();
    };

    const addNewCard = () => {
        setNewCards((prev) => [
        {
            deck: deckID,
            description: "",
            image_url: "",
            is_negative: false,
            name: "",
            id: `new-${prev.length}`,
        },
        ...prev,
        ]);
        scrollToTop();
    };

    const scrollToTop = () => {
        if (tableRef.current) {
        tableRef.current.scrollTop = 0;
        }
    };
    return (
        <>
        <DecksBackground />
        <NavBar />
        <div className="top-container">
            <form className="deck-form-container">
            <div data-mdb-input-init className="form-outline mb4">
                <label className="form-label" htmlFor="form1Example">
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
                <label className="form-label" htmlFor="form1Example">
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
            <div data-mdb-input-init className="form-check">
                <input
                type="checkbox"
                name="exclude_negative"
                defaultChecked={deckFormData.exclude_negative}
                onChange={handleChange}
                className="form-check-input"
                />
                <label className="form-check-label" htmlFor="form1Example">
                Exclude negative cards from readings
                </label>
            </div>
            </form>
            <div className="save-button-container">
            <button id="save_button">
                <img
                className="edit_buttons"
                src={save_button}
                onClick={handleSubmit}
                />
            </button>
            <button id="delete_deck_button">
                <img
                className="edit_buttons"
                src={delete_deck_button}
                onClick={openDeckDeleteModal}
                />
            </button>
            <div className="tooltip-container">
                <Tooltip content="Add a card">
                <img
                    className="add_icon"
                    src={add_icon}
                    alt="add a card"
                    onClick={addNewCard}
                />
                </Tooltip>
            </div>
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
            <tbody ref={tableRef} className="table-body">
                {newCards.map((card) => (
                    <CreateCard
                    key={card.id}
                    deckID={deckID}
                    token={token}
                    onNewCardAdded={handleNewCardAdded}
                    newCards={newCards}
                    setNewCards={setNewCards}
                    card={card}
                    />
                ))}
                {cards.map((card, index) => (
                    <tr
                    key={card.id}
                    className={`hover-row ${
                        hoveredRow === index ? "expanded" : ""
                    }`}
                    id="hover-row"
                    onMouseEnter={() => setHoveredRow(index)}
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
                        hoveredRow === index ? "full" : ""
                        }`}
                    >
                        <textarea
                        type="text-area"
                        name="description"
                        value={card.description}
                        onChange={(e) => handleCardChange(e, card.id)}
                        className="card-description"
                        rows="10"
                        >
                        {card.description}
                        </textarea>
                    </td>
                    <td>
                        <div data-mdb-input-init className="form-check">
                        <input
                            type="checkbox"
                            name="is_negative"
                            defaultChecked={card.is_negative}
                            onChange={(e) => handleCardChange(e, card.id)}
                            className="form-check-input"
                        />
                        <label
                            className="form-check-label"
                            htmlFor="form1Example"
                        >
                            Card is negative
                        </label>
                        </div>
                    </td>
                    <td>
                        <img
                        className="delete_icon"
                        src={delete_icon}
                        alt="delete a card"
                        onClick={() => openCardDeleteModal(card)}
                        />
                    </td>
                    </tr>
                ))}
            </tbody>
            </table>
        </div>
        {modalVisible && (
            <DeleteModal
            cardTitle={cardToDelete?.name}
            cardID={cardToDelete?.id}
            onCancel={closeModal}
            deckID={deckID}
            token={token}
            imgURL={cardToDelete?.image_url}
            />
        )}

        {deckModalVisible && (
            <DeleteDeckModal
            deckName={deckFormData.name}
            deckID={deckID}
            token={token}
            onCancel={closeDeckModal}
            onDelete={handleDeleteCard}
            />
        )}
        </>
    );
}

export default DeckEdit;
