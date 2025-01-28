function useOvertime(req, res, con) {
    const {id, emea_number, idotartam, felh_tulora, tulora} = req.body
    /* console.log(idotartam);
    console.log(felh_tulora);
    console.log(tulora); */

    const updateOvertime = `UPDATE overtime_records SET idotartam = ?, felh_tulora = ?, tulora = ? WHERE id = ? AND emea_number = ?`

    con.query(updateOvertime, [idotartam, felh_tulora, tulora, id, emea_number], (err) => {
        if(err) {
            return res.status(500).json({message: "Negatív idő beállítása nem sikerült!"})
        }
        return res.status(200).json({message: "Negatív idő rögzítve!", id: id})
    })
    
}



module.exports = {
    useOvertime
};