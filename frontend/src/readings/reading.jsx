import React from "react";
import { useState, useEffect } from "react";
import ReadingBackground from "./background/readingBG.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import NavBar from "../nav";
import "./reading.css";
import sparkles from "./background/sparkles2.gif";
import DeckDropdown from "./dropdown.jsx";
import gemnini_logo from "../assets/gemini.svg";
import loading from "./loading.gif";

function Reading() {
    const [userDecks, setUserDecks] = useState([]);
    const [currentDeck, setCurrentDeck] = useState(null);
    const [reading, setReading] = useState("");
    const [cards, setCards] = useState([]);
    const [chosenCards, setChosenCards] = useState([]);
    const [showReading, setShowReading] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [cardsFadedOut, setCardsFadedOut] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

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
        }
    };

    const fetchReading = async () => {
        if (!token) {
        navigate("/");
        alert("You must be logged in to access this page");
        return;
        }

        if (!currentDeck) {
        alert("Please select a deck first");
        return;
        }

        try {
        const response = await fetch(
            `${import.meta.env.VITE_APP_API_HOST}/api/readings/`,
            {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ deck_id: currentDeck.id }),
            credentials: "include",
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error Data:", errorData);
            throw new Error("Error creating reading");
        }

        const data = await response.json();
        setReading(data);
        setIsLoading(false);
        setShowReading(true);
        setIsBlocked(false);
        } catch (err) {
        console.error("Error during fetch:", err);
        }
    };

    const fetchCards = async () => {
        if (!token) {
        navigate("/");
        alert("You must be logged in to access this page");
        return;
        }

        if (!currentDeck) {
        return;
        }

        try {
        const response = await fetch(
            `${import.meta.env.VITE_APP_API_HOST}/api/decks/${
            currentDeck.id
            }/cards/`,
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
        }
    };

    useEffect(() => {
        fetchUserDecks();
    }, [token]);

    useEffect(() => {
        fetchCards();
    }, [currentDeck]);

    const handleDeckSelect = (deck) => {
        setCurrentDeck(deck);
    };

    const cardsForReading = (cards, reading) => {
        const threeCards = [];
        cards.forEach((card) => {
        if (reading.cards.includes(card.id)) {
            threeCards.push(card);
        }
        });
        setChosenCards(threeCards);
    };

    useEffect(() => {
        if (reading && reading.cards && cards.length > 0) {
        cardsForReading(cards, reading);
        }
    }, [reading]);

    useEffect(() => {
        if (chosenCards.length === 3) {
        setIsLoading(true);

        const loadingTimer = setTimeout(() => {
            setIsLoading(false);
            setShowReading(true);
        }, 900);

        return () => clearTimeout(loadingTimer);
        }
    }, [chosenCards]);

    useEffect(() => {
        if (cardsFadedOut) {
        const readingTimer = setTimeout(() => {
            setShowReading(true);
        }, 2000);

        return () => clearTimeout(readingTimer);
        }
    }, [cardsFadedOut]);

    const readingVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { delay: 1, duration: 1 } },
    };

    const buttonVariants = {
        visible: { opacity: 1 },
        hidden: { opacity: 0, transition: { duration: 2 } },
    };

    return (
        <>
        <ReadingBackground />
        <NavBar />
        {isBlocked && <div className="click-blocker" />}{" "}
        {/* Click blocker overlay */}
        <div className="dd-and-cards-container">
            <DeckDropdown
            className="deck-dropdown"
            decks={userDecks}
            onSelect={handleDeckSelect}
            />
            <motion.div
            className="card-thumbnails-container"
            initial="hidden"
            animate={showReading ? "visible" : "hidden"}
            variants={readingVariants}
            >
            {chosenCards.map((card) => (
                <figure key={card.id} className="card-img-top-display">
                <img
                    key={card.id}
                    className="card-thumbnail"
                    src={card.image_url}
                    alt={card.name}
                />
                <figcaption className="chosen-card-name">{card.name}</figcaption>
                </figure>
            ))}
            </motion.div>
        </div>
        <div className="reading-container">
            <AnimatePresence>
            {isButtonVisible && (
                <motion.button
                className="get-reading-button"
                onClick={() => {
                    if (currentDeck) {
                    setIsButtonVisible(false);
                    setIsBlocked(true);

                    setTimeout(() => {
                        setIsLoading(true);
                        fetchReading();
                    }, 2000);
                    } else {
                    alert("Please select a deck first");
                    }
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                initial="visible"
                animate={isButtonVisible ? "visible" : "hidden"}
                exit="hidden"
                variants={buttonVariants}
                disabled={isBlocked} //
                >
                {isHovered && (
                    <img
                    className="button-sparkles"
                    src={sparkles}
                    alt="sparkles"
                    />
                )}
                Get a reading
                </motion.button>
            )}
            </AnimatePresence>
            <AnimatePresence>
            {isLoading && (
                <motion.div
                className="loading-gif-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                >
                <img src={loading} alt="Loading" className="loading-gif" />
                </motion.div>
            )}
            </AnimatePresence>
            <div className="cards-container">
            {showReading && (
                <motion.div
                className="reading-content"
                initial="hidden"
                animate="visible"
                variants={readingVariants}
                >
                <h2 className="your-reading">Your Reading</h2>
                <p className="actual-reading">{reading.reading}</p>
                </motion.div>
            )}
            </div>
            <img
            className="gemini-logo"
            src={gemnini_logo}
            alt="powered by google gemini"
            />
        </div>
        </>
    );
}

export default Reading;
