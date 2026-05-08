const prisma = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
    // Register
    register: async (req, res) => {
        const {name, email, password, role} = req.body;

        // validasi email
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });

        if (existingUser) {
            return res.status(400).json({ status: false, message: 'Email sudah terdaftar' });
        }

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Simpan user
        const defaultRole = role || 'user';

        await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                role: defaultRole
            }
        });

        res.status(201).json({ status: true, message: 'User berhasil didaftarkan', data: { name, email, role: defaultRole } });
    },

    // Login
    login: async (req, res) => {
        const {email, password} = req.body;

        // Cek user
        const user = await prisma.user.findUnique({
            where: { email: email }
        });
        if (!user) {
            return res.status(400).json({ status: false, message: 'Email tidak ditemukan' });
        }

        // Cek password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ status: false, message: 'Password salah' });
        }

        // Generate token
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.status(200).json({ 
            status: true, 
            message: 'Login berhasil', 
            token,
            user: { id: user.id, name: user.name, role: user.role }
        });
    }
};

module.exports = authController;