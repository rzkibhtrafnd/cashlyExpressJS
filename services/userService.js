const prisma = require('../config/database');
const bcrypt = require('bcryptjs');
const { create, update } = require('../controllers/productController');

const userService = {
    getAllUsers: async () => {
        return await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            },
            orderBy: { id: 'desc' }
        });
    },

    getUserById: async (id) => {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            const error = new Error('User tidak ditemukan');
            error.statusCode = 404;
            throw error;
        }
        return user;
    },

    createUser: async (data) => {
        const { name, email, password, role } = data;
        const validRole = ['admin', 'kasir'].includes(role) ? role : 'kasir';

        // Cek email kembar
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            const error = new Error('Email sudah terdaftar, silakan gunakan email lain');
            error.statusCode = 400;
            throw error;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        return await prisma.user.create({
            data: {
                name,
                email,
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

    updateUser: async (id, data) => {
        const { name, email, password, role } = data;

        // Cek apakah user ada
        const existingUser = await prisma.user.findUnique({
            where: { id: Number(id) }
        });

        if (!existingUser) {
            const error = new Error('User tidak ditemukan');
            error.statusCode = 404;
            throw error;
        }

        if (email && email !== existingUser.email) {
            const emailExists = await prisma.user.findUnique({
                where: { email: email }
            });

            if (emailExists) {
                const error = new Error('Email sudah terdaftar, silakan gunakan email lain');
                error.statusCode = 400;
                throw error;
            }
        }

        const updateData = {
            name: name || existingUser.name,
            email: email || existingUser.email,
            role: role && ['admin', 'kasir'].includes(role) ? role : existingUser.role
        };

        // Hash password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        return await prisma.user.update({
            where: { id: Number(id) },
            data: updateData,
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

    deleteUser: async (id) => {
        // Cek apakah user ada
        const existingUser = await prisma.user.findUnique({
            where: { id: Number(id) }
        });

        if(!existingUser){
            const error = new Error('User tidak ditemukan');
            error.statusCode = 404;
            throw error;
        }

        await prisma.user.delete({
            where: { id: Number(id) }
        });
    }
}

module.exports = userService;