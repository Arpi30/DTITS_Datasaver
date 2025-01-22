import React, {useState} from "react";
import { DataForm } from "../DataForm/DataForm";
import { useAxiosFetch } from "../../Function/Fetch/Fetch";
import {Modal, Button} from 'react-bootstrap';

export const EditDataTable = ({user, show, handleClose}) => {

    const { fetchData } = useAxiosFetch();
    const [formData, setFormData] = useState({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emea: user.emea,
        group: user.csoport,
        month: user.honap,
        type: user.tipus,
        start: user.kezdete,
        end: user.vege,
        reason: user.indok,
        comment: user.megjegyzes,
      });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDateChange = (date, name) => {
        setFormData(prevState => ({
          ...prevState,
          [name]: date
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetchData("http://localhost:3001/updateData", "POST", formData)        
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