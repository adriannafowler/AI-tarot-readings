import React from "react";
import './BG.css'
import signupBG from './signupBG.svg'

export default function SignupBackground() {
    return (
        <div>
            <img className="signupBG" src={signupBG} alt="background" />
        </div>
    );
}
