const authService = require('../services/authService');

const authController = {
    // Register
    register: async (req, res) => {
        const { name, email, password, role } = req.body;

        // Validasi input kosong
        if (!name || !email || !password) {
            return res.status(400).json({ status: false, message: 'Nama, email, dan password wajib diisi' });
        }

        const user = await authService.register({ name, email, password, role });
        res.status(201).json({ status: true, message: 'User berhasil didaftarkan', data: user });
    },

    // Login
    login: async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: false, message: 'Email dan password wajib diisi' });
        }

        const result = await authService.login({ email, password });
        res.status(200).json({
            status: true,
            message: 'Login berhasil',
            token: result.token,
            user: result.user
        });
    },

    // Logout
    logout: async (req, res) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(400).json({ status: false, message: 'Token tidak ditemukan' });
        }

        await authService.logout(token);

        res.status(200).json({ 
            status: true, 
            message: 'Logout berhasil. Akses dengan token ini telah ditutup dari server.' 
        });
    }
};

module.exports = authController;