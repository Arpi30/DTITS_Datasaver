import React, {useState} from "react";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdDoneAll } from "react-icons/md";
import { DateFormat } from "./DateFormat";
import { IoMdRefresh } from "react-icons/io";
import { CiCircleMinus } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";

export const DataTable = ({user, res, selectedRows, selectedAllRows, selectedRowsWithCheckbox, deleteItemHandler, deleteItemsHandler, approveItem, showHandler, handleDecrease, handleIncrease }) => {
    
    
    const columns = [
        { label: "Vezetéknév", key: "lastName" },
        { label: "Családinév", key: "firstName" },
        { label: "Emea", key: "emea_number" },
        { label: "Csoport", key: "csoport" },
        { label: "Hónap", key: "honap" },
        { label: "Típus", key: "tipus" },
        { label: "Kezdete", key: "kezdete", isDate: true },
        { label: "Vége", key: "vege", isDate: true },
        { label: "Indok", key: "indok" },
        { label: "Túlóra", key: "idotartam" },
        { label: "Csúszó keret", key: "felh_tulora" },
        { label: "Negatív idő", key: "tulora" },
        { label: "Megjegyzés", key: "megjegyzes" },
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
                            <tr key={rowIndex}  className="border rounded shadow-sm" style={{backgroundColor: getRowStyle(row.statusz), height: "35px", overflow: "hidden"}}>
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
                    
                                    return (
                                        <td key={colIndex}>
                                            {col.key === "felh_tulora" && row.tipus == "Túlóra" ? (
                                                <>
                                                    <button className="incraseAndDecreaseButton"
                                                        onClick={() => handleDecrease(rowIndex)}
                                                        disabled={row.felh_tulora === 0 || row.statusz == "Approved"}
                                                        
                                                    >
                                                        <CiCircleMinus size={20} />
                                                    </button>
                                                    {cellValue}
                                                    <button className="incraseAndDecreaseButton"
                                                        onClick={() => handleIncrease(rowIndex)}
                                                        disabled={row.tulora === 0 || row.statusz == "Approved"}
                                                        
                                                    >
                                                        <CiCirclePlus size={20} />
                                                    </button>
                                                </>
                                            ) : (
                                                cellValue
                                            )}
                                        </td>
                                    );
                                })}
                                <td>{row.statusz == "Pending" && <MdModeEdit onClick={showHandler} size={15}/>}</td>
                                <td>{row.statusz == "Pending" && <MdDelete onClick={deleteItemHandler} size={15}/>}</td>
                                <td>{user.role == "admin" && (row.statusz === "Pending" ? <MdDoneAll onClick={approveItem} size={15}/> : <IoMdRefresh onClick={approveItem} size={15}/>)}</td>
                            </tr>
                        )
                    })
                )}
            </tbody>
        </table>
    );
}