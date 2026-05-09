const prisma = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authService = {
    register: async (data) => {
        const {name, email, password, role} = data;

        // validasi email
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUser) {
            const error = new Error('Email sudah terdaftar');
            error.statusCode = 400;
            throw error;
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const validRole = role || 'user';

        // Simpan user
        return await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                role: validRole
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });
    },

    login: async (data) => {
        // Cek user
        const { email, password } = data;

        // Cek user
        const user = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!user) {
            const error = new Error('Email tidak ditemukan');
            error.statusCode = 400;
            throw error;
        }

        // Cek password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            const error = new Error('Password salah');
            error.statusCode = 400;
            throw error;
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
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