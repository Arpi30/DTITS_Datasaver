import React from "react";
import { Link } from "react-router-dom";
import { Image } from "react-bootstrap";
import { DropdownMenu } from "./Dropdown";

export const Nav = ({ setUser, isUser }) => {
  
  return (
    <nav className="welcomesiteNavbar">
      <Image src="https://yam-united.telekom.com/web/themes/public/files/a5184677-e3ae-4889-be48-37dbf84041eb?extension=png" className="welcomsiteNavbarImage" />
      {isUser == null ? (
        <>
          <Link className="mx-2 fs-5 text-decoration-none text-light" to="/login">Bejelentkezés</Link>
          <Link className="mx-2 fs-5 text-decoration-none text-light" to="/register">Regisztráció</Link>
        </>
      ) : (
        <div className="w-100 d-flex justify-content-end">
          <DropdownMenu isUser={isUser} setUser={setUser}/>
        </div>
      )}
    </nav>
  );
};
