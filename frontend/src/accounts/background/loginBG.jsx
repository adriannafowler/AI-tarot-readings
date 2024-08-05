import React from "react";
import "./BG.css";
import loginBG from "./loginBG.svg";

export default function LoginBackground() {
    return (
        <div>
        <img className="loginBG" src={loginBG} alt="background" />
        </div>
    );
}
