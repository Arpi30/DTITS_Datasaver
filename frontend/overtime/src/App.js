import React, { useState } from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate  } from "react-router-dom";
import {Nav} from "./Components/Nav/Nav"
import {Login} from "./Components/Login/Login"
import {Register} from "./Components/Registration/Register"
import {Home} from "./Components/Home/Home"
import {Profile} from "./Components/Porfile/Profile"
import { ResetPassword } from "./Components/ResetPassword/ResetPassword";
import { Admin } from "./Components/Admin/Admin";

export default function App() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user"))
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("jwt")
  });

  return (
    <Router>
      <Nav setUser={setUser} isUser={user}/>
      <Routes>
        <Route path="/" element={<Navigate to={user && token ? "/home" : "/login"} />} />
        <Route path="/home" element={user && <Home user={user}/>} />
        <Route path="/profile" element={user && <Profile user={user} />} />
        <Route path="/login" element={<Login setUserData={setUser}/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        {(user && user.role === "admin") && <Route path="/admin" element={<Admin />} />}
        
      </Routes>
    </Router>
  );
}

