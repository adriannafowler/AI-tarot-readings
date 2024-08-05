import React, { useState } from "react";
import { Dropdown, DropdownButton } from 'react-bootstrap';

const DeckDropdown = ({ decks, onSelect }) => {
    const [currentDeck, setCurrentDeck] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSelect = (deck) => {
        setCurrentDeck(deck);
        onSelect(deck);
    };

    return (
        <DropdownButton
            id="dropdown-basic-button"
            title={
                currentDeck ? (
                    <>
                        <img
                            src={currentDeck.img_url}
                            alt="deck image"
                            style={{ width: "30px", marginRight: "10px" }}
                        />
                        {currentDeck.name}
                    </>
                ) : (
                    "Choose a deck"
                )
            }
            show={dropdownOpen}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
            onToggle={() => setDropdownOpen(!dropdownOpen)}
        >
            {decks.map((deck) => (
                <Dropdown.Item
                    className="deck-dropdown-options"
                    key={deck.id}
                    onClick={() => handleSelect(deck)}
                >
                    <img
                        src={deck.img_url}
                        alt="deck image"
                        style={{ width: "30px", marginRight: "10px" }}
                    />
                    {deck.name}
                </Dropdown.Item>
            ))}
        </DropdownButton>
    );
};

export default DeckDropdown;
