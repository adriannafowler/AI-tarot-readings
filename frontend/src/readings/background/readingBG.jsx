import React from "react";
import readingBG from './readingBG.svg';
import './readingBG.css';

export default function ReadingBackground() {
    return (
        <div>
            <img className="readingBG" src={readingBG} alt="background" />
        </div>
    );
}
