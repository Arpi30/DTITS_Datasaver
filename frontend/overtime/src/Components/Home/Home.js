import React from "react";
import { AddOvertime } from "../AddOvertime/AddOvertime";


export const Home = ({user}) => {
    
    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{height: "100vh"}}>
            <div>
                <h1 style={{color: "#e20074"}}>Üdvözöllek {user.firstName}</h1>
            </div>
            <div className="w-25">
                <AddOvertime user={user}/>
            </div>
        </div>
    )
}