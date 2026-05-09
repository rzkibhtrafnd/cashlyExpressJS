const prisma = require('../config/database');

const categoryService = {
    getAllCategories: async () => {
        return await prisma.category.findMany({
            orderBy: { id: 'desc' }
        });
    },

    getCategoryById: async (id) => {
        const category = await prisma.category.findUnique({
            where: { id: Number(id) }
        });

        if (!category) {
            const error = new Error('Kategori tidak ditemukan');
            error.statusCode = 404;
            throw error;
        }
        return category;
    },

    createCategory: async (data) => {
        const { name } = data;

        // Cek nama kembar di database
        const existingCategory = await prisma.category.findFirst({
            where: { name }
        });

        if (existingCategory) {
            const error = new Error('Nama kategori sudah digunakan, silakan gunakan nama lain');
            error.statusCode = 400;
            throw error;
        }

        return await prisma.category.create({
            data: { name }
        });
    },

    updateCategory: async (id, data) => {
        const { name } = data;

        // Cek apakah kategori ada
        const existingCategory = await prisma.category.findUnique({
            where: { id: Number(id) }
        });

        if (!existingCategory) {
            const error = new Error('Kategori tidak ditemukan');
            error.statusCode = 404;
            throw error;
        }

        // Cek nama kembar (kecuali kategori ini sendiri)
        if (name && name !== existingCategory.name) {
            const duplicateCategory = await prisma.category.findFirst({
                where: { 
                    name: name,
                    id: { not: Number(id) }
                }
            });

            if (duplicateCategory) {
                const error = new Error('Nama kategori sudah digunakan, silakan gunakan nama lain');
                error.statusCode = 400;
                throw error;
            }
        }

        return await prisma.category.update({
            where: { id: Number(id) },
            data: { name }
        });
    },

    deleteCategory: async (id) => {
        // Cek apakah kategori ada
        const existingCategory = await prisma.category.findUnique({
            where: { id: Number(id) }
        });

        if (!existingCategory) {
            const error = new Error('Kategori tidak ditemukan');
            error.statusCode = 404;
            throw error;
        }

        await prisma.category.delete({
            where: { id: Number(id) }
        });
    }
};

module.exports = categoryService;