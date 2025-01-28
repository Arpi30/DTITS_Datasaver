const calculateOvertime = require('../../Utils/updateDataHelper')

function addOvertime(req, res, con) {
    const { id, firstName, lastName, emea, group, month, type, start, end, reason, comment } = req.body;
    const totalHours = calculateOvertime.calculateOvertime(start, end, type)
    let addOvertime;
    let queryParams;
    /* console.log(start);
    console.log(end); */
    

    if (type === 'Készenlét') {
        addOvertime = `INSERT INTO overtime_records 
                        (user_id, firstName, lastName, emea_number, csoport, honap, tipus, kezdete, vege, idotartam, indok, megjegyzes) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        queryParams = [id, firstName, lastName, emea, group, month, type, start, end, totalHours, reason, comment];
    } else {
        const idotartam = Math.abs(new Date(end) - new Date(start)) / 36e5;
        addOvertime = `INSERT INTO overtime_records 
                        (user_id, firstName, lastName, emea_number, csoport, honap, tipus, kezdete, vege, idotartam, felh_tulora, indok, megjegyzes) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        queryParams = [id, firstName, lastName, emea, group, month, type, start, end, idotartam, idotartam, reason, comment];
    }

    con.query(addOvertime, queryParams, (err, addRes) => {
        if(err) {
            console.log(err);
            return res.status(500).json({message: "Hiba történt az adatbázis művelet során."})
            
        }

        /* const responseData = `SELECT * FROM overtime_records WHERE user_id=?`

        con.query(responseData, [id], (err, getRes) => {
            if(err) {
                return res.status(500).json({message: "Hiba a lekérdezés művelet során"})
            }
            return res.status(200).json({ message: "Az adatok sikeresen fogadva.", data: getRes });
        }) */
    })
    
}

module.exports = {
    addOvertime
}