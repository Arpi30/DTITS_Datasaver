import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useAxiosFetch } from "../../Function/Fetch/Fetch";
import { useNavigate, Link } from "react-router-dom";

export const Login = ({ setUserData }) => {
  const { fetchData, error } = useAxiosFetch();
  const [incorrectPasswordFlag, setIncorrectPasswordFlag] = useState(() => {
    return JSON.parse(localStorage.getItem('incorrectPasswordFlag')) || false;
  });
  const [incorrectPasswordNumber, setIncorrectPasswordNumber] = useState(() => {
    return JSON.parse(localStorage.getItem('incorrectPasswordNumber')) || null;
  });
  const [formData, setFormData] = useState({
    emea: "",
    email: "",
    password: "",
  });
  let navigate = useNavigate();

  useEffect(() => {
    if (error) {
      setIncorrectPasswordFlag(error.response.data.incorrectPasswordFlag);
      setIncorrectPasswordNumber(error.response.data.incorrectPasswordNumber);
      localStorage.setItem('incorrectPasswordFlag', JSON.stringify(error.response.data.incorrectPasswordFlag));
      localStorage.setItem('incorrectPasswordNumber', JSON.stringify(error.response.data.incorrectPasswordNumber));
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetchData("http://localhost:3001/login", "POST", formData)

    
    
    if(response?.login){
      localStorage.setItem('jwt', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUserData(response.user);
      navigate("/home")
      
    }
  };
  


  return (
      <div>
        <Container className="mt-5 w-25">
        <h2>Bejelentkezés</h2>
        <Form onSubmit={handleSubmit}>
            {/* EMEA ID */}
            <Form.Group className="mb-3" controlId="emea">
            <Form.Label>EMEA Azonosító</Form.Label>
            <Form.Control
                type="text"
                name="emea"
                placeholder="Adja meg az EMEA azonosítóját"
                value={formData.emea}
                onChange={handleChange}
                required
            />
            </Form.Group>

            {/* Email */}
            <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email cím</Form.Label>
            <Form.Control
                type="email"
                name="email"
                placeholder="Adja meg az email címét"
                value={formData.email}
                onChange={handleChange}
                required
            />
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3" controlId="password">
            <Form.Label>Jelszó</Form.Label>
            <Form.Control
                type="password"
                name="password"
                placeholder="Adja meg a jelszavát"
                value={formData.password}
                onChange={handleChange}
                required
            />
            </Form.Group>
            {/*Error handling*/}
            {error &&
              <Alert variant="danger">
                {error.response.data.message}
                <span>Még {5 - incorrectPasswordNumber} probálkozásod van!</span>
              </Alert>
            }
            {/* Reset password */ }
            {/* Submit Button */}
            <Button disabled={incorrectPasswordFlag} variant="primary" type="submit">
            Belépés
            </Button>
            {incorrectPasswordFlag &&
            <Link to="/resetPassword">Jelszó visszaállítás</Link>}
        </Form>
        </Container>
    </div>
  );
};
