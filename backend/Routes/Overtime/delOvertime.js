function delOvertime(req, res, con) {
    const {id, emea_number} = req.body
    const delItem = `DELETE FROM overtime_records WHERE id = ? AND emea_number = ?`
    console.log("delOvertime");
    console.log(req.body);

    con.query(delItem, [id, emea_number], (err) => {
        if(err) {
            console.log(err);
            return res.status(500).json({message: "Hiba a törlés során"})
        }

        return res.status(200).json({message: "Az időpont törölve!"})
    })
}
function delSelectedOvertime(req, res, con) {
    const itemsToDelete = req.body;

    if (!itemsToDelete || itemsToDelete.length === 0) {
        return res.status(400).json({ message: "Nincs törlendő elem!" });
    }

    // Promise-k az összes törlési művelethez
    const deletePromises = itemsToDelete.map((item) => {
        return new Promise((resolve, reject) => {
            const delItem = `DELETE FROM overtime_records WHERE id = ? AND emea_number = ?`;
            con.query(delItem, [item.id, item.emea_number], (err, result) => {
                if (err) {
                    console.log(err);
                    return reject(err); // Ha hiba van, reject
                }
                resolve(result); // Ha sikeres, resolve
            });
        });
    });

    // Promise.all az összes törlés végrehajtásához
    Promise.all(deletePromises)
        .then(() => {
            res.status(200).json({ message: "Minden időpont sikeresen törölve!" });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Hiba történt a törlés során." });
        });
}

module.exports = {
    delOvertime,
    delSelectedOvertime
}