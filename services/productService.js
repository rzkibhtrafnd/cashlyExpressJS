const prisma = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

const UPLOAD_PATH = path.join(__dirname, '../public/uploads');

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

        const existingProduct = await prisma.product.findUnique({
            where: { id: Number(id) }
        });

        if (!existingProduct) {
            const error = new Error('Produk tidak ditemukan');
            error.statusCode = 404;
            throw error;
        }

        if (categoryId) {
            const categoryExists = await prisma.category.findUnique({
                where: { id: Number(categoryId) }
            });
            if (!categoryExists) {
                const error = new Error('Kategori tidak valid');
                error.statusCode = 400;
                throw error;
            }
        }
        
        if (newImage && existingProduct.image) {
            const oldPath = path.join(UPLOAD_PATH, existingProduct.image);
            await fs.unlink(oldPath).catch(() => null);
        }

        return await prisma.product.update({
            where: { id: Number(id) },
            data: {
                categoryId: categoryId ? parseInt(categoryId) : undefined,
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
        const existingProduct = await prisma.product.findUnique({
            where: { id: Number(id) }
        });

        if (!existingProduct) {
            const error = new Error('Produk tidak ditemukan');
            error.statusCode = 404;
            throw error;
        }

        if (existingProduct.image) {
            const imagePath = path.join(UPLOAD_PATH, existingProduct.image);
            await fs.unlink(imagePath).catch(() => null);
        }

        await prisma.product.delete({
            where: { id: Number(id) }
        });
    }
};

module.exports = productService;