const express = require('express');
const app = express();
const PORT = 3001;
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const con = require("./conn");
const logout = require('./Routes/Logout/logout')
const register = require('./Routes/Register/register')
const login = require('./Routes/Login/login')
const protected = require('./Routes/Protected/protected')
const addOvertime = require('./Routes/Overtime/addOvertime')
const resetPassword = require('./Routes/ResetPassword/resetPassword')
const profile = require('./Routes/Profile/profile');
const delOvertime = require('./Routes/Overtime/delOvertime')
const approvedItem = require('./Routes/Overtime/approve')
// Regex validation 
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const emeaRegex = /^\d{9}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
const SECRET_KEY = "nagyon_biztonságos_titok";
const corsOptions = {
    origin: 'http://localhost:3000', // Csak az engedélyezett frontend
    credentials: true, // Sütik és hitelesítési adatok küldésének engedélyezése
};
//Cors használata
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
        
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
// Statikus fájlok kiszolgálása (React build mappa)
app.use(express.static(path.join(__dirname, 'build')));
// Middleware - POST kérésekhez a JSON adatok feldolgozása
app.use(bodyParser.json());



// Regisztrációs útvonal
app.post('/register', (req, res) => {
    register.register(req,res,con, bcrypt, emailRegex, emeaRegex, passwordRegex)
});

// Login útvonal
app.post('/login', (req, res) => {
    login.login(req,res,con, bcrypt, jwt, SECRET_KEY)
});

app.post('/logout', (req, res) => {
    logout.logout(req, res, con)
});

// Egy privát útvonal példája
app.get('/protected', (req, res) => {
    protected.protected(req, res, jwt)
});

// Óraszám hozzáadása 
app.post('/overtime', (req, res) => {
    addOvertime.addOvertime(req, res, con)
});

//Jelszó visszaállítás
app.post('/resetPassword', (req, res) => {
    resetPassword.resetPassword(req, res, con, bcrypt, emeaRegex, passwordRegex)
})

// Óraszámok lekerese és törlése
app.post('/profile', (req, res) => {
    profile.profile(req, res, con)
})
app.delete('/profile', (req, res) => {
    delOvertime.delOvertime(req, res, con)
})
app.delete('/profile/bulk', (req, res) => {
    delOvertime.delSelectedOvertime(req, res, con)
})

// Engedélyeztetés
app.post('/approve', (req, res) => {
    approvedItem.approveItem(req, res, con)
})

// Minden egyéb útvonal kiszolgálása (React routing támogatás)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});