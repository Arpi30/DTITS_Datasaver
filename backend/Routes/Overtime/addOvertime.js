function addOvertime(req, res, con) {
    const { id, firstName, lastName, emea, group, month, type, start, end, reason, comment } = req.body;

    const addOvertime = `INSERT INTO overtime_records 
                        (user_id, firstName, lastName, emea_number, csoport, honap, tipus, kezdete, vege, idotartam, indok, megjegyzes) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, SEC_TO_TIME(TIMESTAMPDIFF(SECOND, ?, ?)), ?, ?)`

    con.query(addOvertime, [id, firstName, lastName, emea, group, month, type, start, end, start, end, reason, comment], (err, addRes) => {
        if(err) {
            console.log(err);
            return res.status(500).json({message: "Hiba történt az adatbázis művelet során."})
            
        }

        const responseData = `SELECT * FROM overtime_records WHERE user_id=?`

        con.query(responseData, [id], (err, getRes) => {
            if(err) {
                return res.status(500).json({message: "Hiba a lekérdezés művelet során"})
            }
            return res.status(200).json({ message: "Az adatok sikeresen fogadva.", data: getRes });
        })
    })
    
}

module.exports = {
    addOvertime
}