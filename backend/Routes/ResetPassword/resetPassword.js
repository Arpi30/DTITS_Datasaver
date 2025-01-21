function resetPassword(req, res, con, bcrypt, emeaRegex, passwordRegex) {
    const {emea, password} = req.body;
    //jelszó hashelése
    const resetHashedPassword = bcrypt.hashSync(password, 10);
    //hibák tárolása objektumban
    let errors = {};
    //hibák definiálása
    if (emea && !emeaRegex.test(emea)) errors.emea = "Az emea számnak 9 számjegyből kell állnia!";
    if (password && !passwordRegex.test(password)) errors.password = `A jelszónak legalább 8 karakterből kell állnia. Tartalmaznia kell 1 kisbetűt, 1 nagybetűt, 1 számot és 1 speciális karaktert (?=.*[!@#$%^&*(),.?":{}|<>])`

    // Ha vannak hibák, küldd vissza őket
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            errors: errors
        });
    }
    //Jelszó módosítása
    const resPassword = `UPDATE user 
                        SET password_hash = ?, incorrect_password_attempts = 0
                        WHERE emea_number = ?`

    con.query(resPassword, [resetHashedPassword, emea], (err, resetResults) => {
        if(err) {
            console.error("Hiba történt a visszaállítás során:", err);
            return res.status(500).json({message: "A jelzó visszaállítás sikertelen!"})
        }
        console.log("Adatok mentve:", resetResults);
        res.status(201).json({
            message: "Sikeres jelszóvisszaállítás",
            data: { resetResults, resetPasswordResult: true },
        });
    })
}

module.exports = {
    resetPassword
}