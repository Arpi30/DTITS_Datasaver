import React, {useState} from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useAxiosFetch } from "../../Function/Fetch/Fetch";
import { useNavigate } from "react-router-dom";

export const ResetPassword = () => {
    const { fetchData, error } = useAxiosFetch();
    const [formData, setFormData] = useState({
        emea: "",
        password: "",
      });
    let navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetchData("http://localhost:3001/resetPassword", "POST", formData)
        if(response.data.resetPasswordResult){
            localStorage.clear()
            navigate("/login")
        }
    };


    return (
        <div>
            <Container className="mt-5 w-25">
                <h2>Jelszó visszaállítás</h2>
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
                    <Button variant="primary" className="me-2" type="submit">
                        Visszaállítás
                    </Button>
                    <Button variant="primary" className="mx-2" onClick={() => navigate("/login")}>
                        Vissza
                    </Button>
                </Form>
            </Container>
        </div>
    )
}