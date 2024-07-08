import { NavLink } from "react-router-dom";
import menuIcon from "./assets/menu_icon.svg";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function NavBar() {
    const [userInfo, setUserInfo] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem('token');
            console.log("Retrieved token from localStorage:", token);

            if (!token) {
                navigate('/');
                alert('You must be logged in to access this page');
                return;
            }

            const user = localStorage.getItem('user');
            if (user) {
                setUserInfo(JSON.parse(user));
                console.log("USER INFO:", userInfo)
            }
            setLoading(false);
        };

        fetchUserInfo();
    }, [navigate]);

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_APP_API_HOST}/api/logout/`, {
                method: 'POST',
                headers: {
                    'Bearer': `Token ${token}`,
                }
            });

            if (!response.ok) {
                console.error('Logout failed');
                return;
            }

            localStorage.removeItem('token');
            setUserInfo(null);
            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <nav className="navbar">
            <div className="left-nav-items">
                <img src={menuIcon} alt="Menu" onClick={toggleMenu} className="menu-icon" />
                {menuOpen && (
                    <ul className="menu">
                        <li><NavLink to="/">Home</NavLink></li>
                        <li>Decks</li>
                        <li>Profile</li>
                        <li>Readings Hx</li>
                        <li>Get a reading</li>
                    </ul>
                )}
            </div>
            <div className="right-nav-items">
                <ul>
                    {userInfo && (
                        <>
                            <li>Hello, {userInfo.first_name}</li>
                            <li><button onClick={handleLogout}>Logout</button></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;
