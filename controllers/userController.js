const userService = require('../services/userService');

const userController = {
    getAll: async (req, res) => {
        const users = await userService.getAllUsers();
        res.json({ status: true, message: 'Daftar pengguna berhasil diambil', data: users });
    },

    getById: async (req, res) => {
        const user = await userService.getUserById(req.params.id);
        res.json({ status: true, message: 'Detail pengguna berhasil diambil', data: user });
    },

    create: async (req, res) => {
        const data = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        };

        const user = await userService.createUser(data);
        res.status(201).json({ status: true, message: 'Pengguna berhasil ditambahkan', data: user });
    },

    update: async (req, res) => {
        const id = req.params.id;
        const data = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        };

        const user = await userService.updateUser(id, data);
        res.json({ status: true, message: 'Pengguna berhasil diperbarui', data: user });
    },

    delete: async (req, res) => {
        await userService.deleteUser(req.params.id);
        res.json({ status: true, message: 'Pengguna berhasil dihapus' });
    }
};

module.exports = userController;