const prisma = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authService = {
    login: async (data) => {
        // Cek user
        const { email, password } = data;

        // Cek user
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            const error = new Error('Email atau password salah');
            error.statusCode = 401;
            throw error;
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d'}
        );

        return {
            token,
            user: { id: user.id, name: user.name, role: user.role }
        };
    },

    logout: async (token) => {
        await prisma.tokenBlacklist.create({
            data: { token: token }
        });
    }

};

module.exports = authService;