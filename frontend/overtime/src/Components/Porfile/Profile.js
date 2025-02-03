import React, {useState, useEffect} from "react";
import {Card, ListGroup, Alert, Button } from 'react-bootstrap';
import { useAxiosFetch } from "../../Function/Fetch/Fetch";
import { DataTable } from "./DataTable";
import { DateFormat } from "./DateFormat";
import { SearchBar } from "./SearchBar";
import { SaveToCSV } from "./SaveToCSV";
import { EditDataTable } from "./EditDataTable";
import { ChartData } from "../ChartData/ChartData";



export const Profile = ({user}) => {
    const { fetchData, error } = useAxiosFetch();
    const [responseData, setResponseData] = useState();
    const [message, setMessage] = useState(null)
    const [selectedRows, setSelectedRows] = useState([])
    const [isAllSelected, setIsAllSelected] = useState(false)
    const [timeLeft, setTimeLeft] = useState(60);
    const [searchItem, setSearchItem] = useState("");
    const [show, setShow] = useState(false);
    const [overtimeButton, setOvertimeButton] = useState(false)

    const fetchProfileData = async () => {
        const getData = {
            emea: user.emea,
            id: user.id,
            role: user.role
        }
        
        try {
            const response = await fetchData("http://localhost:3001/profile", "POST", getData);
            // Az adatok bővítése az eredeti idotartam mentésével
            const initialData = response.data.map((row) => ({
                ...row,
                originalIdotartam: row.idotartam, // Az eredeti idotartam mentése
            }));
            
            setResponseData({ ...response, data: initialData });
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
                return prevSelectedRows.filter((row) => row.id !== rowData.id);
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
            setMessage({message: "Nincs kijelölve sor!"})
            return
        }
        const hasApprovedStatus = selectedRows.some((row) => row.statusz === "Approved");
        if (hasApprovedStatus) {
            setMessage({ message: "Jóváhagyott sor nem törölhető!" });
            return;
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
            const currentStatus = selectedRows[0].statusz
            const newStatus = currentStatus === "Approved" ? "Pending" : "Approved"
            const response = await fetchData("http://localhost:3001/approve", "POST", {
                ...selectedRows[0],
                statusz: newStatus
            });
            
            // Az állapot frissítése az ID alapján
            setResponseData((prevData) => ({
                ...prevData,
                data: prevData.data.map((item) =>
                    item.id === response.id
                        ? { ...item, statusz: newStatus }
                        : item
                    
                ),
            }));
            setMessage(response);
            setSelectedRows([]);
        } catch (error) {
            console.log(error);
        }
    }

    const useOvertimeHours = async () => {
        const overtime = selectedRows[0].negativ_ido
        try {
            const response = await fetchData("http://localhost:3001/useOvertime", "POST", {
                ...selectedRows[0],
                negativ_ido: overtime
            })
            // Az állapot frissítése az ID alapján
            setResponseData((prevData) => ({
                ...prevData,
                data: prevData.data.map((item) =>
                    item.id === response.id
                        ? { ...item, negativ_ido: overtime, originalIdotartam: overtime,}
                        : item
                    
                ),
            }));
            console.log(responseData.data);
            
            setMessage(response);
            setSelectedRows([]);
            setOvertimeButton(false)
        } catch (error) {
            console.log(error);
        }

    }

    const filterData = (data, searchItem) => {
        if (!searchItem) return data; // Ha nincs keresési feltétel, térj vissza az eredeti tömbbel
    
        return data.filter(item => 
            Object.values(item).some(value => 
                String(value).toLowerCase().includes(searchItem.toLowerCase())
            )
        );
    };

    const handleSearch = (event) => {
        setSearchItem(event.target.value);
    };

    useEffect(() => {
        fetchProfileData();
        
    }, []);

    const handleDecrease = (rowIndex) => {
        
        setResponseData((prevData) => {
            const newData = prevData.data.map((row, index) => {
                if (index === rowIndex) {
                    const updatedRow = {
                        ...row,
                        csuszokeret: row.csuszokeret - 1,
                        idotartam: row.idotartam - 1,
                        negativ_ido: row.negativ_ido - 1,
                    };
                    if (updatedRow.csuszokeret < row.csuszokeret) {
                        setOvertimeButton(true);
                    }
                    
                    return updatedRow;
                    
                }
                return row;
            });
            
            return { ...prevData, data: newData };
        });
    };

    const handleIncrease = (rowIndex) => {
        setResponseData((prevData) => {
            const newData = prevData.data.map((row, index) => {
                if (index === rowIndex) {
                    const updatedRow = {
                        ...row,
                        csuszokeret: row.csuszokeret + 1,
                        idotartam: row.idotartam + 1,
                        negativ_ido: row.negativ_ido + 1
                    }
                    if (updatedRow.csuszokeret > row.csuszokeret) {
                        setOvertimeButton(true);
                    }
                    
                    return updatedRow;
                }
                return row;
            });
            return { ...prevData, data: newData };
        });
    };

    const filteredData = responseData?.data ? filterData(responseData.data, searchItem) : [];

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 4000);
            return () => clearTimeout(timer); 
        }
    }, [message]);

    /* useEffect(() => {
        if (timeLeft === 0) {
        fetchProfileData(); 
        setTimeLeft(60)
        return;  
        }

        const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);  
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]); */

    //console.log(responseData?.data);
    
    
    return (
        <div style={{height: "100vh"}} className="d-flex flex-column mx-5 align-items-center">
            <div className="my-5 w-100 d-flex align-items-start">
                <Card style={{ width: '20rem' }}>
                    <Card.Body>
                        <Card.Title><h3>{user.lastName} {user.firstName}</h3></Card.Title>
                        <Card.Subtitle className="mb-2 text-muted"><span style={{fontSize: "12px"}}><span className="fw-bold">Utolsó bejelentkezés:</span> {DateFormat(new Date(user.lastLogin))}</span></Card.Subtitle>
                        <ListGroup variant="flush">
                            <ListGroup.Item><h6><span className="fw-bold">Emea:</span> {user.emea}</h6></ListGroup.Item>
                            <ListGroup.Item><h6><span className="fw-bold">Email:</span> <span style={{color: "#e20074"}}>{user.email}</span></h6></ListGroup.Item>
                            <ListGroup.Item><h6><span className="fw-bold">Csoport:</span> {user.csoport}</h6></ListGroup.Item>
                            <ListGroup.Item><h6><span className="fw-bold">Jog:</span> {user.role}</h6></ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
                <ChartData res={responseData} />
            </div>
            <div className="actionBar d-flex flex-row w-100">
                <SearchBar handleSearch={handleSearch} searchItem={searchItem}/>
                <SaveToCSV datas={responseData && responseData.data}/>
                {(selectedRows.length == 1 && overtimeButton) && <Button className="ms-2" onClick={useOvertimeHours}>Mentés</Button>}
            </div>
            <div className="position-relative w-100">
                <div className="alertParent">
                    {message && <Alert bsPrefix="deleteAlert" >{message.message}</Alert >}
                </div>
                <div className="countdown text-end" style={{fontSize: "12px", color: "#aaaaaa"}}>{timeLeft}</div>
                <div> {responseData &&
                    <DataTable 
                        handleDecrease={handleDecrease}
                        handleIncrease={handleIncrease}
                        showHandler={() => setShow(true)}
                        user={user} 
                        selectedRows={isRowSelected} 
                        selectedAllRows={selectAllRowsWithChecbox}  
                        res={{ ...responseData, data: filteredData }} 
                        selectedRowsWithCheckbox={selectedRowsWithCheckbox}
                        approveItem={approveItem}
                        isSelectedRows={selectedRows}
                        isAllSelected={isAllSelected}
                        deleteItemHandler={() => {
                            selectedRows.length > 1 ? setMessage({message: "Egyszerre csak egy sort lehet törölni!"}) : deleteHandler(selectedRows[0])
                        }}
                        deleteItemsHandler={() => {
                            selectedRows.length <= 1 ? setMessage({message: "Egyszerre több sort lehet törölni!"}) : deleteHandler(selectedRows)

                        }}
                    />}
                    {(selectedRows.length == 1 && show && selectedRows[0]) && 
                        <EditDataTable 
                            handleClose={() => setShow(false)} 
                            show={show} 
                            user={selectedRows[0]}
                            onUpdate={(updatedUser) => {
                                console.log(updatedUser);
                                
                                setResponseData((prevData) => ({ 
                                    ...prevData,
                                    data: prevData.data.map((item) => 
                                        item.id === updatedUser.data.id ? { ...item, ...updatedUser.data } : item
                                    ),
                                }));
                                setMessage(updatedUser)
                                setSelectedRows([])
                            }}
                        />}                                  
                </div>
            </div>
        </div>
    )
}