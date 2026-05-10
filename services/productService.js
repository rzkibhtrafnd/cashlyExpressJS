const prisma = require('../config/database');
const fs = require('fs');
const path = require('path');

const productService = {
    getAllProducts: async () => {
        return await prisma.product.findMany({
            select: {
                id: true,
                name: true,
                price: true,
                image: true,
                createdAt: true,
                updatedAt: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { id: 'desc' },
        });
    },

    getProductById: async (id) => {
        const product = await prisma.product.findUnique({
            select: {
                id: true,
                name: true,
                price: true,
                image: true,
                createdAt: true,
                updatedAt: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            where: { id: Number(id) },
        });

        if (!product) {
            const error = new Error('Produk tidak ditemukan');
            error.statusCode = 404;
            throw error;
        }
        return product;
    },

    createProduct: async (data) => {
        const {categoryId, name, price, image} = data;

        // Cek apakah kategori valid
        const categoryExists = await prisma.category.findUnique({
            where: { id: Number(categoryId) }
        });

        if (!categoryExists) {
            const error = new Error('Kategori tidak valid');
            error.statusCode = 400;
            throw error;
        }
        
        return await prisma.product.create({
            data: {
                categoryId: parseInt(categoryId),
                name,
                price: parseFloat(price),
                image
            },
            select: {
                id: true,
                name: true,
                price: true,
                image: true,
                createdAt: true,
                updatedAt: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
        });
    },

    updateProduct: async (id, data) => {
        const { categoryId, name, price, newImage } = data;

        // Cek apakah produk ada
        const existingProduct = await prisma.product.findUnique({
            where: { id: Number(id) }
        });

        if (!existingProduct) {
            const error = new Error('Produk tidak ditemukan');
            error.statusCode = 404;
            throw error;
        }

        // Cek apakah kategori valid
        const categoryExists = await prisma.category.findUnique({
            where: { id: Number(categoryId) }
        });

        if (!categoryExists) {
            const error = new Error('Kategori tidak valid');
            error.statusCode = 400;
            throw error;
        }
        
        // Hapus gambar lama jika ada dan diganti dengan yang baru
        if (newImage && existingProduct.image) {
            const oldImagePath = path.join(__dirname, '..', 'uploads', existingProduct.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        return await prisma.product.update({
            where: { id: Number(id) },
            data: {
                categoryId: parseInt(categoryId),
                name,
                price: parseFloat(price),
                image: newImage || existingProduct.image
            },
            select: {
                id: true,
                name: true,
                price: true,
                image: true,
                createdAt: true,
                updatedAt: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
        });
    },

    deleteProduct: async (id) => {
        // Cek apakah produk ada
        const existingProduct = await prisma.product.findUnique({
            where: { id: Number(id) }
        });

        if (!existingProduct) {
            const error = new Error('Produk tidak ditemukan');
            error.statusCode = 404;
            throw error;
        }

        // Hapus gambar jika ada
        if (existingProduct.image) {
            const imagePath = path.join(__dirname, '..', 'uploads', existingProduct.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await prisma.product.delete({
            where: { id: Number(id) }
        });
    }
};

module.exports = productService;