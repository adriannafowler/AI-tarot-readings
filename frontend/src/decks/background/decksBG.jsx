import React from "react";
import decksBG from './decksBG.svg'
import './decksBG.css'

export default function DecksBackground() {
    return (
        <div>
            <img className="decksBG" src={decksBG} alt="background" />
        </div>
    );
}
