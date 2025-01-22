function updateData(req, res, con) {
    const {id, firstName, lastName, emea, group, month, type, start, end, reason, comment} = req.body

    const updateQuery = `UPDATE overtime_records
                            SET
                                firstName = ?,
                                lastName = ?,
                                csoport = ?,
                                honap = ?,
                                tipus = ?,
                                kezdete = ?,
                                vege = ?,
                                indok = ?,
                                megjegyzes = ?
                            WHERE
                                id = ?
                            AND
                                emea_number = ?`

    con.query(updateQuery, [firstName, lastName, group, month, type, start, end, reason, comment, id, emea], (err) => {
        if(err) {
            console.log(err);
            
            return res.status(500).json({message: "Hiba az adatok módosítása közben"})
        }
        return res.status(200).json({message: "Az adatok sikeresen módosítva", data: id})
    })
    
}

module.exports = {
    updateData
}