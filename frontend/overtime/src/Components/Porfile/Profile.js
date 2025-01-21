import React, {useState, useEffect} from "react";
import {Card, ListGroup, Alert, Spinner } from 'react-bootstrap';
import { useAxiosFetch } from "../../Function/Fetch/Fetch";
import { DataTable } from "./DataTable";
import { DateFormat } from "./DateFormat";
import { SearchBar } from "./SearchBar";
import { SaveToCSV } from "./SaveToCSV";



export const Profile = ({user}) => {
    const { fetchData, error } = useAxiosFetch();
    const [responseData, setResponseData] = useState(null);
    const [message, setMessage] = useState(null)
    const [selectedRows, setSelectedRows] = useState([])
    const [isAllSelected, setIsAllSelected] = useState(false)
    const [timeLeft, setTimeLeft] = useState(60);

    const fetchProfileData = async () => {
        const getData = {
            emea: user.emea,
            id: user.id,
            role: user.role
        }
        
        try {
            const response = await fetchData("http://localhost:3001/profile", "POST", getData);
            setResponseData(response);
        } catch (err) {
        }
    };

    const selectAllRowsWithChecbox = (e, res) => {
        const checked = e.target.checked
        setIsAllSelected(checked)
        // Az összes sor adat kiválasztása
        if (checked) {
            setSelectedRows(res.data);
        } else {
            // Üresre állítjuk
            setSelectedRows([]);
        }
    }

    const selectedRowsWithCheckbox = (rowData) => {
        setSelectedRows((prevSelectedRows) => {
            if (prevSelectedRows.some((row) => row.id === rowData.id)) {
                // Ha már kijelöltük, eltávolítjuk
                return prevSelectedRows.filter((index) => index !== rowData);
            } else {
                // Egyébként hozzáadjuk
                return [...prevSelectedRows, rowData];
            }
        });
    }
    const isRowSelected = (rowIndex) => {
        // Ha selectedRows függvény, akkor azt hívjuk meg
        return selectedRows.includes(rowIndex);
    };

    const deleteHandler = async (arrOfItems) => {
        if(selectedRows.length == 0){
            alert("No item to delete!")
            return
        }
        try {
            const response = await fetchData(`http://localhost:3001/profile${arrOfItems.length > 1 ? "/bulk" : ""}`, "DELETE", arrOfItems);
            setResponseData((prevData) => ({
                ...prevData,
                data: prevData.data.filter((item) =>
                    arrOfItems.length > 1
                        ? !arrOfItems.some((deletedItem) => deletedItem.id === item.id)
                        : item.id !== arrOfItems.id
                ),
            }));
            setSelectedRows([]);
            setMessage(response);
        } catch (error) {
            
            
        }
    }

    const approveItem = async () => {
        if (selectedRows.length === 0) {
            setMessage({ message: "Nincs kijelölendő sor!" });
            return; 
        }

        try {
            const response = await fetchData("http://localhost:3001/approve", "POST", selectedRows[0]);
            
            // Az állapot frissítése az ID alapján
            setResponseData((prevData) => ({
                ...prevData,
                data: prevData.data.map((item) =>
                    item.id === response.id
                        ? { ...item, statusz: "Approved" }
                        : item
                    
                ),
            }));
            setMessage(response);
            setSelectedRows([]);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchProfileData();
        
    }, []);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 4000);
            return () => clearTimeout(timer); 
        }
    }, [message]);

    useEffect(() => {
        if (timeLeft === 0) {
        fetchProfileData(); 
        setTimeLeft(60)
        return;  
        }

        const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);  
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);
    
    return (
        <div style={{height: "100vh"}} className="d-flex flex-column mx-5 align-items-center">
            <div className="my-5 w-100 d-flex align-items-start">
                <Card style={{ width: '20rem' }}>
                    <Card.Body>
                        <Card.Title><h3>{user.firstName} {user.lastName}</h3></Card.Title>
                        <Card.Subtitle className="mb-2 text-muted"><span style={{fontSize: "12px"}}>Utolsó bejelentkezés: {DateFormat(new Date(user.lastLogin))}</span></Card.Subtitle>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Emea: {user.emea}</ListGroup.Item>
                            <ListGroup.Item>Email: {user.email}</ListGroup.Item>
                            <ListGroup.Item>jogosultság: {user.role}</ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
            </div>
            <div className="actionBar d-flex flex-row w-100">
                <SearchBar />
                <SaveToCSV datas={responseData && responseData.data}/>
            </div>
            <div className="position-relative w-100">
                <div className="alertParent">
                    {message && <Alert bsPrefix="deleteAlert" >{message.message}</Alert >}
                </div>
                <div className="countdown text-end" style={{fontSize: "12px", color: "#aaaaaa"}}>{timeLeft}</div>
                <div> {responseData &&
                    <DataTable 
                        user={user} 
                        selectedRows={isRowSelected} 
                        selectedAllRows={selectAllRowsWithChecbox}  
                        res={responseData} 
                        selectedRowsWithCheckbox={selectedRowsWithCheckbox}
                        approveItem={approveItem}
                        deleteItemHandler={() => {
                            selectedRows.length > 1 ? alert("You can delete only one item of row!") : deleteHandler(selectedRows[0])
                        }}
                        deleteItemsHandler={() => {
                            selectedRows.length <= 1 ? alert("You can delete more then one item of row!") : deleteHandler(selectedRows)

                        }}
                    />}
                                                            
                </div>
            </div>
        </div>
    )
}