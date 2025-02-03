function useOvertime(req, res, con) {
    const {id, emea_number, idotartam, csuszokeret, negativ_ido} = req.body
    /* console.log(idotartam);
    console.log(csuszokeret);
    console.log(negativ_ido); */

    const updateOvertime = `UPDATE overtime_records SET idotartam = ?, csuszokeret = ?, negativ_ido = ? WHERE id = ? AND emea_number = ?`

    con.query(updateOvertime, [idotartam, csuszokeret, negativ_ido, id, emea_number], (err) => {
        if(err) {
            return res.status(500).json({message: "Negatív idő beállítása nem sikerült!"})
        }
        return res.status(200).json({message: "Negatív idő rögzítve!", id: id})
    })
    
}



module.exports = {
    useOvertime
};