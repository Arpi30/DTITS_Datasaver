import React, {useState} from "react";
import { DataForm } from "../DataForm/DataForm";
import { useAxiosFetch } from "../../Function/Fetch/Fetch";
import {Modal, Button} from 'react-bootstrap';
import { format } from 'date-fns';

export const EditDataTable = ({user, show, handleClose, onUpdate}) => {

    //console.log(user);
    
    const { fetchData } = useAxiosFetch();
    const [formData, setFormData] = useState({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emea: user.emea_number,
        group: user.csoport,
        month: user.honap,
        type: user.tipus,
        start: new Date(user.kezdete),
        end: new Date(user.vege),
        reason: user.indok,
        comment: user.megjegyzes
      });
      //console.log(formData);
      
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDateChange = (date, name) => {
        const adjustedDate = new Date(date.getTime());
        const formattedDate = format(adjustedDate, 'yyyy-MM-dd HH:mm');
        setFormData(prevState => ({
            ...prevState,
            [name]: formattedDate
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetchData("http://localhost:3001/updateData", "POST", formData)   
            onUpdate(response);                           
            handleClose()                     
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>A "{formData.reason}" Módosítása</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <DataForm formData={formData} handleChange={handleChange} handleDateChange={handleDateChange} handleSubmit={handleSubmit}/>
                </Modal.Body>
            </Modal>
        </div>
    )
}