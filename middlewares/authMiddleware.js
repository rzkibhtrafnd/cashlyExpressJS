const jwt = require('jsonwebtoken');

// Middleware untuk mengecek apakah user punya token yang valid
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ status: false, message: 'Token tidak disediakan' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: false, message: 'Token tidak valid atau kedaluwarsa' });
        }
        
        req.user = decoded;
        next();
    });
};

// Middleware untuk membatasi akses berdasarkan Role
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                status: false, 
                message: 'Akses ditolak: Kamu tidak memiliki izin (Unauthorized Role)' 
            });
        }
        next();
    };
};

module.exports = { verifyToken, authorizeRole };