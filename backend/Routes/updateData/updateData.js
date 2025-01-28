const calculateOvertime = require('../../Utils/updateDataHelper');

function updateData(req, res, con) {
    const { id, emea, month, type, start, end, reason, comment } = req.body;
    const totalHours = calculateOvertime.calculateOvertime(start, end, type);
    let updateQuery;
    let queryParams;

    console.log(start);
    console.log(end);
    

    if (type === 'Készenlét') {
        updateQuery = `
            UPDATE overtime_records
            SET
                honap = ?,
                tipus = ?,
                kezdete = ?,
                vege = ?,
                idotartam = ?,
                indok = ?,
                megjegyzes = ?
            WHERE
                id = ?
            AND
                emea_number = ?
        `;
        queryParams = [month, type, start, end, totalHours, reason, comment, id, emea];
    } else {
        updateQuery = `
            UPDATE overtime_records
            SET
                honap = ?,
                tipus = ?,
                kezdete = ?,
                vege = ?,
                idotartam = TIMESTAMPDIFF(HOUR, ?, ?),
                felh_tulora = TIMESTAMPDIFF(HOUR, ?, ?),
                tulora = 0,
                indok = ?,
                megjegyzes = ?
            WHERE
                id = ?
            AND
                emea_number = ?
        `;
        queryParams = [month, type, start, end, start, end, start, end, reason, comment, id, emea];
    }

    con.query(updateQuery, queryParams, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Hiba az adatok módosítása közben." });
        }

        return res.status(200).json({message: "Az adatok sikeresen módosítva", data: id})

    });
}

module.exports = {
    updateData
};
