const prisma = require('../config/database');

const transactionService = {
    getAll: async (user, month, year, page = 1) => {
        const limit = 10;
        const skip = (page - 1) * limit;

        let whereClause = {};
        if (user.role !== 'admin') {
            whereClause.userId = user.id;
        }

        if (month && year) {
            const startDate = new Date(year, month - 1, 1);
            const endDate = new Date(year, month, 0, 23, 59, 59);
            whereClause.createdAt = {
                gte: startDate,
                lte: endDate
            };
        }

        const transactions = await prisma.transaction.findMany({
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
            orderBy: { createdAt: 'desc' },
            skip: skip,
            take: limit
        });

        const totalItems = await prisma.transaction.count({ where: whereClause });

        return {
            data: transactions,
            meta: {
                page: Number(page),
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

        const productIds = cart.map(item => item.id);

        const actualProducts = await prisma.product.findMany({
            where: {
                id: { in: productIds }
            },
            select: { id: true, price: true }
        });

        const priceMap = {};
        actualProducts.forEach(product => {
            priceMap[product.id] = Number(product.price);
        });

        let calculatedTotal = 0;
        const validItems = [];

        for (const item of cart) {
            const actualPrice = priceMap[item.id];

            if (actualPrice === undefined) {
                const error = new Error(`Produk dengan ID ${item.id} tidak ditemukan atau sudah dihapus`);
                error.statusCode = 404;
                throw error;
            }

            const qty = Number(item.qty);
            if (qty < 1) {
                const error = new Error(`Kuantitas produk tidak valid`);
                error.statusCode = 400;
                throw error;
            }

            const subtotal = qty * actualPrice;
            calculatedTotal += subtotal;

            validItems.push({
                productId: item.id,
                qty: qty,
                price: actualPrice,
                subtotal: subtotal
            });
        }

        const transaction = await prisma.$transaction(async (tx) => {
            const newTrx = await tx.transaction.create({
                data: {
                    userId: userId,
                    total: calculatedTotal,
                    paymentMethod: paymentMethod || 'cash',
                    paymentStatus: 'paid'
                }
            });

            const itemsData = validItems.map(item => ({
                transactionId: newTrx.id,
                productId: item.productId,
                qty: item.qty,
                price: item.price,
                subtotal: item.subtotal
            }));

            await tx.transactionItem.createMany({
                data: itemsData
            });

            return newTrx;
        });

        return transaction;
    },

    show: async (id, user) => {
        const transaction = await prisma.transaction.findUnique({
            where: { id: Number(id) },
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
                },
                items: {
                    select: {
                        id: true,
                        qty: true,
                        price: true,
                        subtotal: true,
                        product: {
                            select: {
                                id: true,
                                name: true,
                                price: true
                            }
                        }
                    }
                }
            }
        });

        if (!transaction) {
            const error = new Error('Transaksi tidak ditemukan');
            error.statusCode = 404;
            throw error;
        }

        if (user.role !== 'admin' && transaction.userId !== user.id) {
            const error = new Error('Kamu tidak memiliki akses ke transaksi ini');
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