import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";


export const ChartData = ({res}) => {

    //console.log(res);
    const [chartData, setChartData] = useState([])

    const processChartData = (data) => {
        const groupedData = {};
    
        data.forEach((item) => {
            const honap = item.honap;
            const tipus = item.tipus;
            const idotartam = item.idotartam;
            //const tulora = item.tulora;
    
            if (!groupedData[honap]) {
                groupedData[honap] = { honap: honap, keszenlet: 0, tulora: 0 };
            }
    
            if (tipus === "Készenlét") {
                groupedData[honap].keszenlet += idotartam;
            } else if (tipus === "Túlóra") {
                groupedData[honap].tulora += idotartam;
            }
        });
    
        return Object.values(groupedData);
    };

    useEffect(() => {
    if (res) {
        // Az adatokat feldolgozzuk a kívánt formátumra
        const processedData = processChartData(res.data);
        setChartData(processedData);
    }
    }, [res]);

    return(
        <ResponsiveContainer width="100%" height={300}>
            <BarChart 
            data={chartData}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="honap" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="keszenlet" fill="#8884d8" name="Készenlét" stackId="a"/>
                <Bar dataKey="tulora" fill="#82ca9d" name="Túlóra" stackId="a"/>
            </BarChart>
        </ResponsiveContainer>
    )
    

}