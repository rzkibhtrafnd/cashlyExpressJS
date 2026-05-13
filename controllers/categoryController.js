const categoryService = require('../services/categoryService');
const asyncHandler = require('../middlewares/asyncHandler');

const categoryController = {
    getAll: asyncHandler(async (req, res) => {
        const categories = await categoryService.getAllCategories();
        res.json({ status: true, message: 'Daftar kategori berhasil diambil', data: categories });
    }),

    create: asyncHandler(async (req, res) => {
        const { name } = req.body;
        if (!name) {
            const error = new Error('Nama kategori wajib diisi');
            error.statusCode = 400;
            throw error;
        }

        const category = await categoryService.createCategory({ name });
        res.status(201).json({ status: true, message: 'Kategori berhasil ditambahkan', data: category });
    }),

    update: asyncHandler(async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            const error = new Error('Nama kategori wajib diisi');
            error.statusCode = 400;
            throw error;
        }

        const category = await categoryService.updateCategory(id, { name });
        res.json({ status: true, message: 'Kategori berhasil diperbarui', data: category });
    }),

    delete: asyncHandler(async (req, res) => {
        await categoryService.deleteCategory(req.params.id);
        res.json({ status: true, message: 'Kategori berhasil dihapus' });
    })
};

module.exports = categoryController;