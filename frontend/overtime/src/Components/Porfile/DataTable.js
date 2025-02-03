import React, {useState} from "react";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdDoneAll } from "react-icons/md";
import { DateFormat } from "./DateFormat";
import { IoMdRefresh } from "react-icons/io";
import { CiCircleMinus } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";

export const DataTable = ({user, res, selectedRows, selectedAllRows, selectedRowsWithCheckbox, deleteItemHandler, deleteItemsHandler, approveItem, showHandler, handleDecrease, handleIncrease, isSelectedRows }) => {
    
    
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
        { label: "Időtartam", key: "idotartam" },
        { label: "Csúszó keret", key: "csuszokeret" },
        { label: "Negatív idő", key: "negativ_ido" },
        { label: "Megjegyzés", key: "megjegyzes" },
        //{ label: "Jóváhagyás", key: "jovahagyas" },
        { label: "Státusz", key: "statusz" },
        { label: "Létrehozva", key: "created_at", isDate: true },
        { label: "Frissítve", key: "updated_at", isDate: true },
        { label: <button disabled={isSelectedRows.length < 2} className="actionButton"><MdDelete onClick={deleteItemsHandler} size={15}/></button>, key: "delete" },
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

    const enabledActionButton = (row) => {
        return !isSelectedRows.some(selected => selected.id === row.id)
    }
    
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
                                            {col.key === "csuszokeret" && row.tipus == "Túlóra" ? (
                                                <>
                                                    <button className="incraseAndDecreaseButton"
                                                        onClick={() => handleDecrease(rowIndex)}
                                                        disabled={row.csuszokeret === 0 || row.statusz == "Approved"}
                                                        
                                                    >
                                                        <CiCircleMinus size={20} />
                                                    </button>
                                                    {cellValue}
                                                    <button className="incraseAndDecreaseButton"
                                                        onClick={() => handleIncrease(rowIndex)}
                                                        disabled={row.negativ_ido === 0 || row.statusz == "Approved"}
                                                        
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
                                <td>{row.statusz == "Pending" && <button disabled={enabledActionButton(row)} className="actionButton"><MdModeEdit  onClick={showHandler} size={15}/></button>}</td>
                                <td>{row.statusz == "Pending" && <button disabled={enabledActionButton(row)} className="actionButton"><MdDelete onClick={deleteItemHandler} size={15}/></button>}</td>
                                <td>{user.role == "admin" && (row.statusz === "Pending" ? <button disabled={enabledActionButton(row)} className="actionButton"><MdDoneAll onClick={approveItem} size={15}/></button> : <button className="actionButton"><IoMdRefresh onClick={approveItem} size={15}/></button>)}</td>
                            </tr>
                        )
                    })
                )}
            </tbody>
        </table>
    );
}