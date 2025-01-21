import React from "react";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdDoneAll } from "react-icons/md";
import { DateFormat } from "./DateFormat";

export const DataTable = ({user, res, selectedRows, selectedAllRows, selectedRowsWithCheckbox, deleteItemHandler, deleteItemsHandler, approveItem}) => {
    
    const columns = [
        { label: "Családinév", key: "firstName" },
        { label: "Vezetéknév", key: "lastName" },
        { label: "Emea", key: "emea_number" },
        { label: "Csoport", key: "csoport" },
        { label: "Hónap", key: "honap" },
        { label: "Típus", key: "tipus" },
        { label: "Kezdete", key: "kezdete", isDate: true },
        { label: "Vége", key: "vege", isDate: true },
        { label: "Indok", key: "indok" },
        { label: "Megjegyzés", key: "megjegyzes" },
        { label: "Időtartam", key: "idotartam" },
        { label: "Negatív idő", key: "negativ_ido" },
        //{ label: "Jóváhagyás", key: "jovahagyas" },
        { label: "Státusz", key: "statusz" },
        { label: "Létrehozva", key: "created_at", isDate: true },
        { label: "Frissítve", key: "updated_at", isDate: true },
        { label: <MdDelete onClick={deleteItemsHandler} size={15}/>, key: "delete" },
    ];
    
    
    const getRowStyle = (statusz) => {
        switch (statusz) {
            case 'Pending':
                return '#fcfbb6';
            case 'Approved':
                return '#bdfcb6';
            case 'Rejected':
                return '#f78f8f';
            default:
                return {};
        }
    };
    
    return (
        <table className="w-100" style={{ borderSpacing: "0 10px", borderCollapse: "separate", cursor: "pointer" }}>
            <thead>
                <tr className="success">
                    <th>
                        <input type="checkbox" onChange={(e) => selectedAllRows(e, res)} />
                    </th>
                    {columns.map((col, index) => (
                        <th key={index}>{col.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {res && res.data.length > 0 && (
                    res.data.map((row, rowIndex) => {
                        
                        return (
                            <tr key={rowIndex}  className="border rounded shadow-sm" style={{backgroundColor: getRowStyle(row.statusz), height: "35px"}}>
                                <td>
                                    <input type="checkbox" 
                                    onChange={() => selectedRowsWithCheckbox(row)} 
                                    checked={selectedRows(row)}
                                    />
                                </td>
                                {columns.map((col, colIndex) => {
                                    let cellValue = row[col.key] || "";

                                    // Ha az oszlop dátumot tartalmaz, akkor formázzuk
                                    if (col.isDate && cellValue) {
                                      cellValue = DateFormat(new Date(cellValue));
                                    }
                    
                                    return <td key={colIndex}>{cellValue}</td>;
                                })}
                                <td>{<MdModeEdit size={15}/>}</td>
                                <td>{<MdDelete onClick={deleteItemHandler} size={15}/>}</td>
                                <td>{user.role == "admin" && <MdDoneAll onClick={approveItem} size={15}/>}</td>
                            </tr>
                        )
                    })
                )}
            </tbody>
        </table>
    );
}