function admin (req, res, con) {
    const getProfileDataToAdmin = `SELECT * FROM user;`

    con.query(getProfileDataToAdmin, [], (err, getProfil) => {
        if(err) {
            return res.status(500).json({message: "Hiba történt!"})
        }
        console.log("Lekért adatok: ", getProfil);
        return res.status(200).json({message: "Sikeres adatlekérés", data: getProfil})
    })
}

module.exports = {
    admin
}