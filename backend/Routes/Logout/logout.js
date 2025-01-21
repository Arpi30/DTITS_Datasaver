function logout(req, res, con) {
    const { id, emea } = req.body;
    
    // SQL lekérdezés paraméterezéssel
    const updateLogoutColumn = `
        UPDATE user
        SET login = false
        WHERE id = ? AND emea_number = ?
    `;
    con.query(updateLogoutColumn, [id, emea], (err) => {
        if (err) {
            console.error("Hiba történt a kijelentkezés során:", err);
            return res.status(500).json({ error: "Nem sikerült módosítani a kijelentkezést." });
        }
        // Válasz az ügyfélnek
        res.json({ message: "Sikeres kijelentkezés!" });
    });
}

module.exports = {
    logout
}