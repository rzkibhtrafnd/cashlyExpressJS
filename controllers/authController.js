const authService = require('../services/authService');
const asyncHandler = require('../middlewares/asyncHandler');

const authController = {
    login: asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error('Email dan password wajib diisi');
            error.statusCode = 400;
            throw error;
        }

        const result = await authService.login({ email, password });
        
        res.status(200).json({
            status: true,
            message: 'Login berhasil',
            token: result.token,
            user: result.user
        });
    }),

    logout: asyncHandler(async (req, res) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            const error = new Error('Token tidak ditemukan');
            error.statusCode = 400;
            throw error;
        }

        await authService.logout(token);

        res.status(200).json({ 
            status: true, 
            message: 'Logout berhasil. Sesi telah diakhiri.' 
        });
    })
};

module.exports = authController;