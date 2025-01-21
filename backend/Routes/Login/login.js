function login (req, res, con, bcrypt, jwt, SECRET_KEY) {
    const { emea, email, password } = req.body;

    // Felhasználó keresése adatbázisban
    const userFind = `
        SELECT id, first_name, last_name, emea_number, email, password_hash, user_role, user_created_time, login, incorrect_password_attempts, last_login
        FROM user 
        WHERE emea_number = ? AND email = ?
    `;
    
    con.query(userFind, [emea, email], (err, results) => {
        if (err) {
            console.error("Hiba történt a lekérdezés során:", err);
            return res.status(500).json({ error: "Hiba történt az adatbázis művelet során." });
        }

        // Ellenőrizni, hogy van-e találat
        if (results.length === 0) {
            return res.status(404).json({ login: false, message: "Felhasználó nem található." });
        }

        // Első találat lekérése
        const user = results[0];
        
        // Jelszó ellenőrzése
        const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
        
        if (!isPasswordValid) {
            let newAttempts = (user.incorrect_password_attempts || 0) + 1;
            const updateAttempts = `
                UPDATE user
                SET incorrect_password_attempts = ?
                WHERE emea_number = ? AND email = ?
            `;
            
            con.query(updateAttempts, [newAttempts, emea, email], (err) => {
                if (err) {
                    console.error("Hiba történt a próbálkozások számának frissítésekor:", err);
                    return res.status(500).json({ error: "Hiba történt a próbálkozások számának frissítése során." });
                }

                if (newAttempts < 5) {
                    return res.status(401).json({ login: false, message: "Helytelen jelszó.", incorrectPasswordFlag: false, incorrectPasswordNumber: newAttempts });
                } else {
                    return res.status(401).json({ login: false, message: "Helytelen jelszó.", incorrectPasswordFlag: true, incorrectPasswordNumber: newAttempts });
                }
            });
            console.log(newAttempts);
            
            return;
        }

        // Frissítés: login mező beállítása true-ra
        const updateLoginStatus = `
            UPDATE user
            SET login = true, incorrect_password_attempts = 0
            WHERE emea_number = ? AND email = ?
        `;

        con.query(updateLoginStatus, [emea, email], (err) => {
            if (err) {
                console.error("Hiba történt a login státusz frissítésekor:", err);
                return res.status(500).json({ error: "Hiba történt a státusz frissítése során." });
            }

            // Frissített adat lekérdezése
            con.query(userFind, [emea, email], (err, updatedResults) => {
                if (err) {
                    console.error("Hiba történt az adatok újra-lekérésekor:", err);
                    return res.status(500).json({ error: "Hiba történt az adatok újra-lekérése során." });
                }

                const updatedUser = updatedResults[0];

                // JWT generálása
                const token = jwt.sign(
                    { emea: updatedUser.emea, email: updatedUser.email, role: updatedUser.user_role },
                    SECRET_KEY,
                    { expiresIn: "1h" } // Token érvényessége (1 óra)
                );

                // Sikeres válasz
                res.status(200).json({
                    login: updatedUser.login,
                    message: "Sikeres bejelentkezés!",
                    token,
                    user: {
                        login: updatedUser.login,
                        id: updatedUser.id,
                        firstName: updatedUser.first_name,
                        lastName: updatedUser.last_name,
                        emea: updatedUser.emea_number,
                        email: updatedUser.email,
                        role: updatedUser.user_role,
                        createdTime: updatedUser.user_created_time,
                        lastLogin: updatedUser.last_login
                    },
                });
            });
        });
    });
}

module.exports = {
    login
}