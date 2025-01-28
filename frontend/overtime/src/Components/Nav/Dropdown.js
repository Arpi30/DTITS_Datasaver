import React from "react";
import { Dropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Logout } from "../Logout/Logout";
import { TbClockHour8 } from "react-icons/tb";
import { MdOutlineSaveAlt } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";


export const DropdownMenu = ({ setUser, isUser}) => {
    
    
    return (
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                <span>{isUser.lastName}</span> <span>{isUser.firstName}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <div className="d-flex flex-column px-2">
                    <Link className="navbarLink" to="/home"><TbClockHour8 size={20}/> Hozzáadás</Link>
                    <Link className="navbarLink" to="/profile"><MdOutlineSaveAlt size={20}/> Mentett órák</Link>
                    {isUser.role === "admin" && <Link className="navbarLink" to="/admin"><RiAdminLine  size={20}/> Admin</Link>}
                    <Logout setUser={setUser}> Kijelentkezés</Logout>
                </div>
            </Dropdown.Menu>
        </Dropdown>
    )
}