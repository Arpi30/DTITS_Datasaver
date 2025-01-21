import React from "react";
import { Dropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Logout } from "../Logout/Logout";

export const DropdownMenu = ({ setUser, isUser}) => {
    
    return (
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                <span>{isUser.firstName}</span> <span>{isUser.lastName}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <div className="d-flex flex-column">
                    <Link to="/home">Főoldal</Link>
                    <Link to="/profile">Felhasználó</Link>
                    <Logout setUser={setUser}>Kijelentkezés</Logout>
                </div>
            </Dropdown.Menu>
        </Dropdown>
    )
}