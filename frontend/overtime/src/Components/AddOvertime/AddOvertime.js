import React, {useState} from "react";
import { useAxiosFetch } from "../../Function/Fetch/Fetch";
import "react-datepicker/dist/react-datepicker.css";
import { DataForm } from "../DataForm/DataForm";
import { format } from 'date-fns';


export const AddOvertime = ({user}) => {
    const { fetchData } = useAxiosFetch();
    const [formData, setFormData] = useState({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emea: user.emea,
        group: user.csoport,
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
        //const adjustedDate = new Date(date.getTime() + 60 * 60 * 1000);
        console.log('Date object received:', date);
        const adjustedDate = new Date(date.getTime());
        console.log(adjustedDate);

        const formattedDate = format(adjustedDate, 'yyyy-MM-dd HH:mm');
        
        setFormData(prevState => ({
            ...prevState,
            [name]: formattedDate 
        }));
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetchData("http://localhost:3001/overtime", "POST", formData) 
        console.log(formData);
               
    };


    return (
        <DataForm formData={formData} handleChange={handleChange} handleDateChange={handleDateChange} handleSubmit={handleSubmit}/>
    )
}