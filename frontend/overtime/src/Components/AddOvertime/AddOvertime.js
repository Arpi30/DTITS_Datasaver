import React, {useState} from "react";
import { useAxiosFetch } from "../../Function/Fetch/Fetch";
import "react-datepicker/dist/react-datepicker.css";
import { DataForm } from "../DataForm/DataForm";


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
        // Hozzáadunk 1 órát a dátumhoz
        const adjustedDate = new Date(date.getTime() + 60 * 60 * 1000);
        setFormData(prevState => ({
            ...prevState,
            [name]: adjustedDate
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetchData("http://localhost:3001/overtime", "POST", formData)        
    };


    return (
        <DataForm formData={formData} handleChange={handleChange} handleDateChange={handleDateChange} handleSubmit={handleSubmit}/>
    )
}