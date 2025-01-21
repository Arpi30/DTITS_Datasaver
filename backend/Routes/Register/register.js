function register (req, res, con, bcrypt, emailRegex, emeaRegex, passwordRegex) {
    const { firstname, lastname, emea, email, password, userRole } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    // Hibák tárolása
    let errors = {};

    // Input mezők validálása
    if (email && !emailRegex.test(email)) errors.email = `A megadott email cím hibás, kérlek figyelj hogy a @ előtti rész tartalmazon betűket, számokat és bizonyos speciális karaktereket, például ., %, +, -.
                                                            A @ utáni rész betűket, számokat, kötőjeleket és pontokat tartalmaz.
                                                            Az email végződjön (pl. .com, .org).`;
    if (emea && !emeaRegex.test(emea)) errors.emea = "Az emea számnak 9 számjegyből kell állnia!";
    if (password && !passwordRegex.test(password)) errors.password = `A jelszónak legalább 8 karakterből kell állnia. Tartalmaznia kell 1 kisbetűt, 1 nagybetűt, 1 számot és 1 speciális karaktert (?=.*[!@#$%^&*(),.?":{}|<>])`

    // Ha vannak hibák, küldd vissza őket
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            errors: errors
        });
    }
  
    // Ellenőrzés: létezik-e már ilyen email vagy emea_number
    const checkSql = "SELECT * FROM user WHERE emea_number = ? OR email = ?";
    con.query(checkSql, [emea, email], (checkErr, checkResult) => {
        if (checkErr) {
            console.error("Hiba történt az ellenőrzés során:", checkErr);
            return res.status(500).json({ error: "Hiba történt az adatbázis művelet során." });
        }

        if (checkResult.length > 0) {
            // Ha már létezik ilyen adat
            return res.status(409).json({
                message: "A megadott EMEA azonosító vagy email cím már létezik!",
            });
        }

        // Ha nincs ütközés, folytatódhat a regisztráció
        const insertSql = "INSERT INTO user (first_name, last_name, emea_number, email, password_hash, user_role) VALUES (?, ?, ?, ?, ?, ?);";
        con.query(insertSql, [firstname, lastname, emea, email, hashedPassword, userRole], (insertErr, result) => {
            if (insertErr) {
                console.error("Hiba történt a beszúrás során:", insertErr);
                return res.status(500).json({ error: "Hiba történt az adatbázis művelet során." });
            }
            console.log("Adatok mentve:", result);
            res.status(201).json({
                message: "Sikeres regisztráció",
                data: { firstname, lastname, emea, email, userRole },
            });
        });
    });
}

module.exports = {
    register
}