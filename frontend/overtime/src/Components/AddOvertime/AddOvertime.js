import React, {useState} from "react";
import {Form} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import { useAxiosFetch } from "../../Function/Fetch/Fetch";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export const AddOvertime = ({user}) => {
    const { fetchData } = useAxiosFetch();
    const [formData, setFormData] = useState({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emea: user.emea,
        group: "",
        month: "",
        type: "",
        start: new Date(),
        end: new Date(),
        reason: "",
        comment: "",
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
        const response = await fetchData("http://localhost:3001/overtime", "POST", formData)
        //console.log(user);
        //console.log(response);
        
    };


    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formGroupGroup">
                <Form.Select name="group" aria-label="Default select example" onChange={handleChange} value={formData.group}>
                    <option>Válassz csoportod</option>
                    <option value="1">App1</option>
                    <option value="2">App2</option>
                </Form.Select>
            </Form.Group>
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
                    <option>Szeotember</option>
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
            <Form.Group className="mb-3" controlId="formGroupTimeStart">
                <Form.Label>Készenlét/Túlóra/Csúszó kezdete</Form.Label>
                <DatePicker dateFormat="yyyy/MM/dd HH:mm" timeFormat="HH:mm" showTimeSelect selected={formData.start} onChange={(date) => handleDateChange(date, "start")} value={formData.start} name="start"/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupTimeEnd">
                <Form.Label>Készenlét/Túlóra/Csúszó vége</Form.Label>
                <DatePicker dateFormat="yyyy/MM/dd HH:mm" timeFormat="HH:mm" showTimeSelect selected={formData.end} onChange={(date) => handleDateChange(date, "end")} value={formData.end} name="end"/>
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