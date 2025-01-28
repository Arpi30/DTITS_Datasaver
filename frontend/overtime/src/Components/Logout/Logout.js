import React from "react";
import { useNavigate } from "react-router-dom"; 
import { useAxiosFetch } from "../../Function/Fetch/Fetch";
import { Link } from "react-router-dom";
import { MdLogout } from "react-icons/md";

export const Logout = ({ setUser }) => {
    const { fetchData, error } = useAxiosFetch();
    const localStorageData = localStorage.getItem("user")
    const navigate = useNavigate(); // Navigáció a kijelentkezés után

    const handleLogout = async () => {
        try {
            const response = await fetchData('http://localhost:3001/logout',"POST", localStorageData, {});
            console.log(response);
            
            if(response){
                localStorage.clear();
                setUser(null)
                navigate("/login")
                
              } else {
                alert("Nem sikerült kijelentkezni!");
            }
        } catch (error) {
            console.error("Hiba történt a kijelentkezés során:", error);
            alert("Nem sikerült kijelentkezni!");
        }
    };

    return (
        <Link onClick={handleLogout} className="logout-button navbarLink">
            <MdLogout size={20}/> Kijelentkezés
        </Link>
    );
};
