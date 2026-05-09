const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: false, message: 'Akses ditolak: Token tidak ditemukan' });
    }

    try {
        // Cek Blaclist Token
        const isBlacklisted = await prisma.tokenBlacklist.findFirst({
            where: { token: token }
        });

        if (isBlacklisted) {
            return res.status(401).json({ status: false, message: 'Akses ditolak: Token sudah tidak berlaku (Silakan login kembali)' });
        }

        // Cek Token asli
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();

    } catch (err) {
        return res.status(401).json({ status: false, message: 'Akses ditolak: Token tidak valid atau kedaluwarsa' });
    }
};

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