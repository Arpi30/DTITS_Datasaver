import React, { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useAxiosFetch } from "../../Function/Fetch/Fetch";

export const Register = () => {
  const [responseData, setResponseData] = useState(null);
  const { fetchData, error } = useAxiosFetch();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    emea: "",
    email: "",
    password: "",
    userRole: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetchData("http://localhost:3001/register", "POST", formData)
     // Ha van válasz és az nem hiba, tároljuk a válasz adatot
    if (response && !response.error) {
      setResponseData(response);  // Sikeres válasz tárolása
    } else if (response && response.message) {
      setResponseData({ message: response.message });  // Hibaüzenet a backend-től
    }
  };
  
  return (
      <div>
        <Container className="mt-5 w-25">
        <h2>Regisztráció</h2>
        <Form onSubmit={handleSubmit}>
            {/* First Name */}
            <Form.Group className="mb-3" controlId="firstname">
            <Form.Label>Keresztnév</Form.Label>
            <Form.Control
                type="text"
                name="firstname"
                placeholder="Adja meg a keresztnevét"
                value={formData.firstname}
                onChange={handleChange}
                required
            />
            </Form.Group>

            {/* Last Name */}
            <Form.Group className="mb-3" controlId="lastname">
            <Form.Label>Vezetéknév</Form.Label>
            <Form.Control
                type="text"
                name="lastname"
                placeholder="Adja meg a vezetéknevét"
                value={formData.lastname}
                onChange={handleChange}
                required
            />
            </Form.Group>

            {/* EMEA ID */}
            <Form.Group className="mb-3" controlId="emea">
            <Form.Label>EMEA Azonosító</Form.Label>
            <Form.Control
                type="text"
                name="emea"
                placeholder="Adja meg az EMEA azonosítóját"
                value={formData.emea}
                onChange={handleChange}
                aria-describedby="emeaHelpError"
                required
            />
            {error &&
            <Form.Text className="text-danger" id="emeaHelpError">
              {error.response.data.errors.emea}
            </Form.Text>
            }
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
                aria-describedby="emailHelpError"
            />
            {error &&
            <Form.Text className="text-danger" id="emailHelpError">
              {error.response.data.errors.email}
            </Form.Text>
            }
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
                aria-describedby="passHelpError"
                required
            />
            {error &&
            <Form.Text className="text-danger" id="passHelpError">
              {error.response.data.errors.password}
            </Form.Text>
            }
            </Form.Group>

            {/* User Role */}
            <Form.Group className="mb-3" controlId="userRole">
            <Form.Label>Felhasználói jogosultság</Form.Label>
            <Form.Select
                name="userRole"
                value={formData.userRole}
                onChange={handleChange}
                required
            >
                <option value="">Válassza ki a jogosultsági szintet</option>
                <option value="admin">Admin</option>
                <option value="user">Felhasználó</option>
            </Form.Select>
            </Form.Group>

            {/* Submit Button */}
            <Button variant="primary" type="submit">
            Regisztráció
            </Button>
            {/* Válasz üzenet megjelenítése */}
            {responseData && (
                    <div className="mt-3 text-success">
                        <p>{responseData.message}</p>
                    </div>
                )}

                {/* Hibák megjelenítése */}
                {error && (
                    <div className="mt-3 text-danger">
                        <p>{error.response.data.message}</p>
                    </div>
                )}
        </Form>
        </Container>
    </div>
  );
};
