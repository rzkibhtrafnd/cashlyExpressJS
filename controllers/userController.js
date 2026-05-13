const userService = require('../services/userService');
const asyncHandler = require('../middlewares/asyncHandler');

const userController = {
    getAll: asyncHandler(async (req, res) => {
        const users = await userService.getAllUsers();
        res.json({ status: true, message: 'Daftar pengguna berhasil diambil', data: users });
    }),

    getById: asyncHandler(async (req, res) => {
        const user = await userService.getUserById(req.params.id);
        res.json({ status: true, message: 'Detail pengguna berhasil diambil', data: user });
    }),

    create: asyncHandler(async (req, res) => {
        if (!req.body.name || !req.body.email || !req.body.password) {
            const error = new Error('Nama, email, dan password wajib diisi');
            error.statusCode = 400;
            throw error; 
        }

        const user = await userService.createUser(req.body);
        res.status(201).json({ status: true, message: 'Pengguna berhasil ditambahkan', data: user });
    }),

    update: asyncHandler(async (req, res) => {
        const user = await userService.updateUser(req.params.id, req.body);
        res.json({ status: true, message: 'Pengguna berhasil diperbarui', data: user });
    }),

    delete: asyncHandler(async (req, res) => {
        await userService.deleteUser(req.params.id);
        res.json({ status: true, message: 'Pengguna berhasil dihapus' });
    })
};

module.exports = userController;