import React, { useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';

function DeleteDeckModal({ deckName, deckID, onCancel, token }) {
    const navigate = useNavigate();
    const modalRef = useRef();

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onCancel();
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDelete = async () => {
        try {
            const deckResponse = await fetch(`${import.meta.env.VITE_APP_API_HOST}/api/decks/${deckID}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });


            if (!deckResponse.ok) {
                const errorData = await deckResponse.json();
                console.error('Error Data:', errorData);
                throw new Error('Error editing deck');
            }
        } catch (err) {
            console.error("Error during deck DELETE:", err);
            setError(err.message);
        }

    onCancel(); // Close the modal after deletion
    navigate(`/decks/`)

    }

    return (
        <div className="modal fade show" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered" role="document" ref={modalRef}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLongTitle">Are you sure you want to delete this Deck?</h5>
                    </div>
                    <div className="modal-body">
                        <h2>{deckName}</h2>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={onCancel}>Cancel</button>
                        <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeleteDeckModal;
