const prisma = require('../config/database');

const transactionService = {
    getAll: async (user, month, year, page = 1) => {
        const currentPage = Math.max(1, Number(page) || 1); 
        const limit = 10;
        const skip = (currentPage - 1) * limit;

        let whereClause = {};
        if (user.role !== 'admin') {
            whereClause.userId = user.id;
        }

        if (month && year) {
            const m = Number(month);
            const y = Number(year);
            const startDate = new Date(y, m - 1, 1);
            const endDate = new Date(y, m, 0, 23, 59, 59, 999);
            whereClause.createdAt = { gte: startDate, lte: endDate };
        }

        const [transactions, totalItems] = await Promise.all([
            prisma.transaction.findMany({
                where: whereClause,
                select: {
                    id: true, userId: true, total: true, paymentMethod: true, paymentStatus: true, createdAt: true,
                    user: { select: { id: true, name: true } }
                },
                orderBy: { createdAt: 'desc' },
                skip: skip,
                take: limit
            }),
            prisma.transaction.count({ where: whereClause })
        ]);

        return {
            data: transactions,
            meta: {
                page: currentPage,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit)
            }
        };
    },

    store: async (userId, data) => {
        const { cart, paymentMethod } = data;

        if (!Array.isArray(cart) || cart.length === 0) {
            const error = new Error('Keranjang tidak valid atau kosong');
            error.statusCode = 400;
            throw error;
        }

        const productIds = [...new Set(cart.map(item => Number(item.id)))];

        const actualProducts = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, price: true }
        });

        const priceMap = {};
        actualProducts.forEach(p => { priceMap[p.id] = Number(p.price); });

        let calculatedTotal = 0;
        const validItems = [];

        const groupedCart = cart.reduce((acc, item) => {
            const id = Number(item.id);
            if (!acc[id]) acc[id] = 0;
            acc[id] += Number(item.qty);
            return acc;
        }, {});

        for (const [idStr, qty] of Object.entries(groupedCart)) {
            const productId = Number(idStr);
            const actualPrice = priceMap[productId];

            if (actualPrice === undefined) {
                const error = new Error(`Produk dengan ID ${productId} tidak ditemukan atau sudah dihapus`);
                error.statusCode = 404;
                throw error;
            }

            const subtotal = qty * actualPrice;
            calculatedTotal += subtotal;

            validItems.push({ productId, qty, price: actualPrice, subtotal });
        }

        return await prisma.$transaction(async (tx) => {
            const newTrx = await tx.transaction.create({
                data: {
                    userId: Number(userId),
                    total: calculatedTotal,
                    paymentMethod: paymentMethod || 'cash',
                    paymentStatus: 'paid',
                    items: {
                        create: validItems.map(item => ({
                            productId: item.productId,
                            qty: item.qty,
                            price: item.price,
                            subtotal: item.subtotal
                        }))
                    }
                },
                include: { items: true } 
            });

            return newTrx;
        });
    },

    show: async (id, user) => {
        const transaction = await prisma.transaction.findUnique({
            where: { id: Number(id) },
            include: {
                user: { select: { id: true, name: true } },
                items: { include: { product: { select: { id: true, name: true, price: true } } } }
            }
        });

        if (!transaction) {
            const error = new Error('Transaksi tidak ditemukan');
            error.statusCode = 404;
            throw error;
        }

        if (user.role !== 'admin' && transaction.userId !== user.id) {
            const error = new Error('Akses ditolak');
            error.statusCode = 403;
            throw error;
        }

        return transaction;
    },

    report: async (month, year) => {
        let whereClause = {};
        
        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);
            whereClause.createdAt = {
                gte: startDate,
                lte: endDate
            };
        }

        return await prisma.transaction.findMany({
            where: whereClause,
            select: {
                id: true,
                userId: true,
                total: true,
                paymentMethod: true,
                paymentStatus: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
};

module.exports = transactionService;