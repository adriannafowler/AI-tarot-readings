import { NavLink } from "react-router-dom";
import menuIcon from "./assets/menu_icon.svg"
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'


function NavBar() {
    const [userInfo, setUserInfo] = useState(null)
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        // const csrfToken = getCookie('csrftoken');
         // A function to get the CSRF token from cookies

        console.log("TOKEN:", token);  // Log token for debugging
        if (token) {
            fetch(`${import.meta.env.VITE_APP_API_HOST}/api/userinfo/`, {
                headers: {
                    'Authorization': `Token ${token}`,
                    // 'X-CSRFToken': csrfToken,  // Add CSRF token header
                },
                credentials: 'include'  // Include credentials if needed
            })
            .then(response => {
                console.log("RESPONSE:", response);  // Log response for debugging
                if (response.ok) {
                    return response.json();
                } else if (response.status === 401 || response.status === 403) {
                    navigate('/');
                    alert('You must be logged in to access tarot decks');
                    return null;
                } else {
                    throw new Error('Error fetching user info');
                }
            })
            .then(data => {
                console.log("DATA:", data)
                if (data) {
                    setUserInfo(data);
                }
            })
            .catch(error => console.error('Error fetching user info:', error));
        } else {
            navigate('/');
            alert('You must be logged in to access tarot decks');
        }
    }, [navigate]);

    // function getCookie(name) {
    //     let cookieValue = null;
    //     if (document.cookie && document.cookie !== '') {
    //         const cookies = document.cookie.split(';');
    //         for (let i = 0; i < cookies.length; i++) {
    //             const cookie = cookies[i].trim();
    //             if (cookie.substring(0, name.length + 1) === (name + '=')) {
    //                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
    //                 break;
    //             }
    //         }
    //     }
    //     return cookieValue;
    // }

    const handleLogout = () => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`${import.meta.env.VITE_APP_API_HOST}/api/logout/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    localStorage.removeItem('token');
                    setUserInfo(null);
                    navigate('/login');
                } else {
                    console.error('Logout failed');
                }
            })
            .catch(error => console.error('Error during logout:', error));
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

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
    )
}

export default NavBar
