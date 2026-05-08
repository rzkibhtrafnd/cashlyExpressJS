const prisma = require('../config/database');

const categoryController = {
    // Index
    getAll: async (req, res) => {
        const categories = await prisma.category.findMany({
            orderBy: { id: 'desc' }
        });
        res.json({ status: true, message: 'Daftar kategori berhasil diambil', data: categories });
    },

    // Store
    create: async (req, res) => {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ status: false, message: 'Nama kategori wajib diisi' });
        }

        // cek nama sama
        const existingCategory = await prisma.category.findFirst({
            where: { name: name }
        });

        if (existingCategory) {
            return res.status(400).json({ status: false, message: 'Nama kategori sudah digunakan, silakan gunakan nama lain' });
        }

        const category = await prisma.category.create({
            data: { name }
        });

        res.status(201).json({ status: true, message: 'Kategori berhasil ditambahkan', data: category });
    },

    // Update
    update: async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;

        // Cek Kategori
        const existingCategory = await prisma.category.findUnique({ where: { id: Number(id) } });
        if (!existingCategory) {
            return res.status(404).json({ status: false, message: 'Kategori tidak ditemukan' });
        }

        // Cek nama sama
        if (name && name !== existingCategory.name) {
            const duplicateCategory = await prisma.category.findFirst({
                where: { 
                    name: name,
                    id: { not: Number(id) }
                }
            });

            if (duplicateCategory) {
                return res.status(400).json({ status: false, message: 'Nama kategori sudah digunakan, silakan gunakan nama lain' });
            }
        }

        const category = await prisma.category.update({
            where: { id: Number(id) },
            data: { name }
        });

        res.json({ status: true, message: 'Kategori berhasil diperbarui', data: category });
    },

    // Delete
    delete: async (req, res) => {
        const { id } = req.params;

        // Cek Kategori
        const existingCategory = await prisma.category.findUnique({ where: { id: Number(id) } });
        if (!existingCategory) {
            return res.status(404).json({ status: false, message: 'Kategori tidak ditemukan' });
        }

        await prisma.category.delete({
            where: { id: Number(id) }
        });

        res.json({ status: true, message: 'Kategori berhasil dihapus' });
    }
};

module.exports = categoryController;