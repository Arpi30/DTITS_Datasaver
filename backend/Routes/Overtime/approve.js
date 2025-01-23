function approveItem(req, res, con) {

    const {id, statusz} = req.body
    console.log(req.body);
    

    if (!id) {
        return res.status(400).json({ message: "Nincs kijelölendő sor!" });
    }

    const approvedItem = "UPDATE overtime_records SET statusz = ? WHERE id = ?"

    con.query(approvedItem, [statusz, id], (err) => {
        if(err) {
            console.log(err);
            return res.status(500).json({message: "Hiba a jóváhagyás közben!"})
        }
        
        return res.status(200).json({message: req.body.statusz === 'Approved' ? "Sikeresen jóváhagyva!" : "Jóváhagyás visszavonva!", id: id})
    })
}

module.exports = {
    approveItem
}