import { NavLink } from "react-router-dom";
import menuIcon from "./assets/menu_icon.svg";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./index.css";

function NavBar() {
    const [userInfo, setUserInfo] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("login/");
            alert("You must be logged in to access this page");
            return;
        }

        const user = localStorage.getItem("user");
        if (user) {
            setUserInfo(JSON.parse(user));
        }
        setLoading(false);
        };

        fetchUserInfo();
    }, [navigate]);

    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        const refresh = localStorage.getItem("refresh");

        if (!token || !refresh) return;

        try {
        const response = await fetch(
            `${import.meta.env.VITE_APP_API_HOST}/api/logout/`,
            {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh }),
            credentials: "include",
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Logout failed:", errorData);
            return;
        }

        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        setUserInfo(null);
        navigate("/login");
        } catch (error) {
        console.error("Error during logout:", error);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <nav className="navbar">
        <div className="dropdown">
            <img
            type="button"
            id="inventoryDropdown"
            aria-expanded="false"
            src={menuIcon}
            alt="Menu"
            onClick={toggleMenu}
            className="menu-icon"
            />
            {menuOpen && (
            <ul className="menu">
                <li id="link1">
                <NavLink className="nav-link" to="/decks/">
                    My Decks
                </NavLink>
                </li>
                <li>
                <NavLink className="nav-link" to="/reading/">
                    Get a Reading
                </NavLink>
                </li>
                <li>
                <button onClick={handleLogout}>Logout</button>
                </li>
            </ul>
            )}
        </div>
        <div className="right-nav-items">
            <ul>
            {userInfo && (
                <div className="logout-message">
                <li>Hello, {userInfo.first_name}</li>
                <li>
                    <button id="logout-button" onClick={handleLogout}>
                    Logout
                    </button>
                </li>
                </div>
            )}
            </ul>
        </div>
        </nav>
    );
}

export default NavBar;
