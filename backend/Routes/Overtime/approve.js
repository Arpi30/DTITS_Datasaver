function approveItem(req, res, con) {

    const {id} = req.body

    if (!id) {
        return res.status(400).json({ message: "Nincs kijelölendő sor!" });
    }

    const approvedItem = "UPDATE overtime_records SET statusz = 'Approved' WHERE id = ?"

    con.query(approvedItem, [id], (err) => {
        if(err) {
            console.log(err);
            return res.status(500).json({message: "Hiba a jóváhagyás közben!"})
        }
        
        return res.status(200).json({message: "Sikeresen jóváhagyva!", id: id})
    })

}

module.exports = {
    approveItem
}