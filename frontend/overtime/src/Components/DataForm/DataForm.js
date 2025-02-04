import React from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { format } from 'date-fns';

import "react-datepicker/dist/react-datepicker.css";
import {Form, Button} from 'react-bootstrap';

export const DataForm = ({formData, handleChange, handleSubmit, handleDateChange}) => {
    

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formGroupMonth">
                <Form.Select name="month" onChange={handleChange} value={formData.month}>
                    <option >Add meg a hónapot</option>
                    <option >Január</option>
                    <option>Február</option>
                    <option>Március</option>
                    <option>Április</option>
                    <option>Május</option>
                    <option>Június</option>
                    <option>Július</option>
                    <option>Augusztus</option>
                    <option>Szeptember</option>
                    <option>Október</option>
                    <option>November</option>
                    <option>December</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupType">
                <Form.Select name="type" onChange={handleChange} value={formData.type}>
                    <option >Add meg a típust</option>
                    <option >Túlóra</option>
                    <option>Készenlét</option>
                    <option>Csúszó</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3 d-flex flex-column" controlId="formGroupTimeStart">
                <Form.Label>Készenlét/Túlóra/Csúszó kezdete</Form.Label>
                <DatePicker dateFormat="yyyy/MM/dd HH:mm" timeFormat="HH:mm" showTimeSelect selected={new Date(formData.start)} onChange={(date) => handleDateChange(date, "start")} value={formData.start} name="start"/>
            </Form.Group>
            <Form.Group className="mb-3 d-flex flex-column" controlId="formGroupTimeEnd">
                <Form.Label>Készenlét/Túlóra/Csúszó vége</Form.Label>
                <DatePicker dateFormat="yyyy/MM/dd HH:mm" timeFormat="HH:mm" showTimeSelect selected={new Date(formData.end)} onChange={(date) => handleDateChange(date, "end")} value={formData.end} name="end"/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupReason">
                <Form.Label>Indok</Form.Label>
                <Form.Control name="reason" type="text" placeholder="Add meg a bevitt órák indokát" onChange={handleChange} value={formData.reason}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupComment">
                <Form.Label>Megjegyzés</Form.Label>
                <Form.Control name="comment" type="text" placeholder="Adj megjegyzést" onChange={handleChange} value={formData.comment}/>
            </Form.Group>
            <Button type="submit">Küldés</Button>
        </Form>
    )
}