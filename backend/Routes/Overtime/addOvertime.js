function addOvertime(req, res, con) {
    const { id, firstName, lastName, emea, group, month, type, start, end, reason, comment } = req.body;
    const totalHours = calculateOvertime(start, end, type)
    let addOvertime;
    let queryParams;

    if (type === 'Készenlét') {
        addOvertime = `INSERT INTO overtime_records 
                        (user_id, firstName, lastName, emea_number, csoport, honap, tipus, kezdete, vege, idotartam, indok, megjegyzes) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        queryParams = [id, firstName, lastName, emea, group, month, type, start, end, totalHours, reason, comment];
    } else {
        addOvertime = `INSERT INTO overtime_records 
                        (user_id, firstName, lastName, emea_number, csoport, honap, tipus, kezdete, vege, idotartam, indok, megjegyzes) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TIMESTAMPDIFF(HOUR, ?, ?), ?, ?)`;
        queryParams = [id, firstName, lastName, emea, group, month, type, start, end, start, end, reason, comment];
    }

    con.query(addOvertime, queryParams, (err, addRes) => {
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

const isWeekend = (date) => {
    const day = new Date(date).getDay();
    return (day === 6) || (day === 0);
};

const calculateOvertime = (start, end, type) => {
    if (type !== 'Készenlét') {
        return 0;
    }

    let totalDuration = 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    // Kezdő nap óráinak kiszámítása
    totalDuration += isWeekend(startDate) ? (24 - startDate.getHours()) : (24 - startDate.getHours());
    // Vég nap óráinak kiszámítása
    totalDuration += isWeekend(endDate) ? endDate.getHours() : endDate.getHours();

    // Köztes napok kezelése
    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0);
    currentDate.setDate(currentDate.getDate() + 1);

    while (currentDate < endDate && currentDate.toDateString() !== endDate.toDateString()) {
        totalDuration += isWeekend(currentDate) ? 24 : 13
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return totalDuration;
};

module.exports = {
    addOvertime,
    calculateOvertime
}