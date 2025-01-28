import React, {useState, useEffect} from "react";
import { useAxiosFetch } from "../../Function/Fetch/Fetch";
import { Container, Card, ListGroup, ListGroupItem, Button, Alert } from "react-bootstrap";


export const Admin = () => {
    const { fetchData, error } = useAxiosFetch();
    const [profileData, setProfileData] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchProfileData = async () => {
        try {
            const response = await fetchData("http://localhost:3001/admin", "POST");
            setProfileData(response);
        } catch (err) {
        }
    };

    useEffect(() => {
        fetchProfileData()
    },[])

    const handleUserClick = (user) => {
        setSelectedUser(user === selectedUser ? null : user); // Toggle user details
      };
    console.log(profileData);
    
    
    return (
        <Container className="mt-5">
            <h1 className="text-center">Felhasználók</h1>
            {error && <Alert variant="danger">Hiba történt az adatok lekérésekor!</Alert>}

            <ListGroup>
                {profileData?.data?.map((user) => (
                <ListGroupItem
                    key={user.id}
                    className="mb-3 p-3 adminProfilList"
                    action
                    onClick={() => handleUserClick(user)}
                    style={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    background: "#e20074"
                    }}
                >
                    <strong className="text-light">{user.last_name} {user.first_name}</strong>

                    {selectedUser === user && (
                    <Card className="mt-3">
                        <Card.Body>
                        <Card.Title>Felhasználói adatok</Card.Title>
                        <Card.Text>
                            <p><strong>Felhasználónév:</strong> {user.last_name} {user.first_name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>EMEA Szám:</strong> {user.emea_number}</p>
                            <p><strong>Szerepkör:</strong> {user.user_role}</p>
                            <p><strong>Utolsó belépés:</strong> {new Date(user.last_login).toLocaleString()}</p>
                            <p><strong>Létrehozva:</strong> {new Date(user.user_created_time).toLocaleString()}</p>
                            <p><strong>Jelszó probálkozások:</strong> {user.incorrect_password_attempts}</p>
                        </Card.Text>
                        <Button className="me-2" variant="secondary" onClick={() => setSelectedUser(null)}>
                            Bezárás
                        </Button>
                        <Button variant="secondary" onClick={() => setSelectedUser(null)}>
                            Jelszó visszaállítás
                        </Button>
                        </Card.Body>
                    </Card>
                    )}
                </ListGroupItem>
                ))}
            </ListGroup>
        </Container>
    )
}