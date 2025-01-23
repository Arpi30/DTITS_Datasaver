import React, {useState} from "react";
import { DataForm } from "../DataForm/DataForm";
import { useAxiosFetch } from "../../Function/Fetch/Fetch";
import {Modal, Button} from 'react-bootstrap';

export const EditDataTable = ({user, show, handleClose, onUpdate}) => {

    
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
        comment: user.megjegyzes,
        statusz: user.statusz
      });
      //console.log(formData);
      
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDateChange = (date, name) => {
        // Hozzáadunk 1 órát a dátumhoz
        const adjustedDate = new Date(date.getTime() + 60 * 60 * 1000);
        setFormData(prevState => ({
            ...prevState,
            [name]: adjustedDate
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetchData("http://localhost:3001/updateData", "POST", formData)    
              
            if (onUpdate) {
                //onUpdate(formData);
                window.location.reload()        //ideiglenes megoldás. A probléma az hogy a selectedRows[0] és a Profile responseData strukturája nem eggyezik meg.
            }                                   //Az onUpdate proppal próbálom frissítani a responseData statet az EditDataTable formData state-jével de eltél a struktúra..
            handleClose()                       // Utána kell nézni hogy hol változik meg a 2 state struktúrája vagy a backend oldalról visszaküldöm az adott sort 
                                                // és azzal írom felül a responseData state-et.
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