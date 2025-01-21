function protected(req, res, jwt) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).json({ message: "Token hiányzik." });
    }

    const token = authHeader.split(' ')[1];
    try {
        const user = jwt.verify(token, SECRET_KEY);
        res.json({ message: "Hozzáférés engedélyezve.", user });
    } catch (err) {
        res.status(403).json({ message: "Érvénytelen vagy lejárt token." });
    }
}

module.exports = {
    protected
}