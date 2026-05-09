const categoryService = require('../services/categoryService');

const categoryController = {
    // Index
    getAll: async (req, res) => {
        const categories = await categoryService.getAllCategories();
        res.json({ status: true, message: 'Daftar kategori berhasil diambil', data: categories });
    },

    // Store
    create: async (req, res) => {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ status: false, message: 'Nama kategori wajib diisi' });
        }

        const category = await categoryService.createCategory({ name });
        res.status(201).json({ status: true, message: 'Kategori berhasil ditambahkan', data: category });
    },

    // Update
    update: async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ status: false, message: 'Nama kategori wajib diisi' });
        }

        const category = await categoryService.updateCategory(id, { name });
        res.json({ status: true, message: 'Kategori berhasil diperbarui', data: category });
    },

    // Delete
    delete: async (req, res) => {
        const { id } = req.params;

        // Semua logika cek ID & hapus ada di service
        await categoryService.deleteCategory(id);
        res.json({ status: true, message: 'Kategori berhasil dihapus' });
    }
};

module.exports = categoryController;