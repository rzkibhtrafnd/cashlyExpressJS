const prisma = require('../config/database');

const productController = {
    // Index
    getAll: async (req, res) => {
        const products = await prisma.product.findMany({
            orderBy: { id: 'desc' },
            include: { category: true }
        });
        res.json({ status: true, message: 'Daftar produk berhasil diambil', data: products });
    },

    // Store
    create: async (req, res) => {
        const { categoryId, name, price } = req.body;
        const image = req.file ? req.file.filename : null;

        // Cek apakah kategori valid
        const categoryExists = await prisma.category.findUnique({
            where: { id: Number(categoryId) }
        });

        if (!categoryExists) {
            return res.status(400).json({ status: false, message: 'Kategori tidak valid' });
        }

        const product = await prisma.product.create({
            data: {
                categoryId: parseInt(categoryId),
                name,
                price: parseFloat(price),
                image: image
            },
            include: { category: true }
        });

        res.status(201).json({ status: true, message: 'Produk berhasil ditambahkan', data: product });
    },

    // Show
    getById: async (req, res) => {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
            include: { category: true }
        });

        if (!product) {
            return res.status(404).json({ status: false, message: 'Produk tidak ditemukan' });
        }

        res.json({ status: true, message: 'Detail produk berhasil diambil', data: product });
    },
    
    // Update
    update: async (req, res) => {
        const { id } = req.params;
        const { categoryId, name, price } = req.body;
        const image = req.file ? req.file.filename : null;

        // Cek produk
        const existingProduct = await prisma.product.findUnique({
            where: { id: Number(id) }
        });

        if (!existingProduct) {
            return res.status(404).json({ status: false, message: 'Produk tidak ditemukan' });
        }

        // Cek kategori
        if (categoryId) {
            const categoryExists = await prisma.category.findUnique({
                where: { id: Number(categoryId) }
            });

            if (!categoryExists) {
                return res.status(400).json({ status: false, message: 'Kategori tidak valid' });
            }
        }

        const updatedProduct = await prisma.product.update({
            where: { id: Number(id) },
            data: {
                categoryId: categoryId ? parseInt(categoryId) : existingProduct.categoryId,
                name: name || existingProduct.name,
                price: price ? parseFloat(price) : existingProduct.price,
                image: image || existingProduct.image
            },
            include: { category: true }
        });

        res.json({ status: true, message: 'Produk berhasil diperbarui', data: updatedProduct });
    },

    // Delete
    delete: async (req, res) => {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: { id: Number(id) }
        });

        if (!product) {
            return res.status(404).json({ status: false, message: 'Produk tidak ditemukan' });
        }

        await prisma.product.delete({
            where: { id: Number(id) }
        });

        res.json({ status: true, message: 'Produk berhasil dihapus' });
    }
};

module.exports = productController;