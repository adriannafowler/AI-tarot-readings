import React from "react";
import "./home-page.css";
import { useNavigate } from "react-router-dom";
import login from "./login.svg";
import signup from "./signup.svg";
import BackgroundVideo from "./background/bgvid.jsx";

function HomePage() {
    const navigate = useNavigate();

    return (
        <>
        <div>
            <BackgroundVideo />
        </div>
        <header>
            <ul>
            <li>
                <button id="login_button">
                <img
                    className="home-img"
                    src={login}
                    onClick={() => navigate("/login")}
                />
                </button>
            </li>
            <li>
                <button id="signup_button">
                <img
                    className="home-img"
                    src={signup}
                    onClick={() => navigate("/signup")}
                />
                </button>
            </li>
            </ul>
        </header>
        </>
    );
}

export default HomePage;
