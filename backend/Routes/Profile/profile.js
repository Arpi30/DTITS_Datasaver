function profile(req, res, con) {
    const {emea, id, role} = req.body;
    //console.log(req.body);
    
    let getData;
    if (role === 'admin') {
        getData = `SELECT 
                        u.id,
                        u.user_role,
                        r.*
                    FROM 
                        user u
                    JOIN 
                        overtime_records r
                    ON 
                        u.id = r.user_id`;
    } else {
        getData = `SELECT 
                        u.id,
                        u.user_role,
                        r.*
                    FROM 
                        user u
                    JOIN 
                        overtime_records r
                    ON 
                        u.id = r.user_id
                    WHERE 
                        r.user_id = ?`;
    }

    con.query(getData, [id], (err, getDataResults) => {
        if(err) {  
            console.log(err);
            return res.status(500).json({message: "Hiba a lekérdezés során"})
        }
        //console.log("Lekérdezés eredménye:", getDataResults); // Ellenőrzés
        return res.status(200).json({message: "Az adatok sikeresen megérkeztek", data: getDataResults})
    })
}

module.exports = {
    profile
}