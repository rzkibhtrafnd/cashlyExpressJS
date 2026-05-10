const prisma = require('../config/database');

const dashboardService = {
    getAdminDashboard: async () => {
        const [
            categoriesCount,
            productsCount,
            transactionsCount,
            revenueAggregation,
            recentTransactions
        ] = await Promise.all([
            prisma.category.count(),
            prisma.product.count(),
            prisma.transaction.count(),
            prisma.transaction.aggregate({ _sum: { total: true } }),
            prisma.transaction.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    userId: true,
                    total: true,
                    paymentStatus: true,
                    createdAt: true,
                    user: { select: { id: true, name: true } }
                }
            })
        ]);

        const topItems = await prisma.transactionItem.groupBy({
            by: ['productId'],
            _sum: { qty: true, subtotal: true },
            orderBy: { _sum: { qty: 'desc' } },
            take: 5
        });

        const productIds = topItems.map(item => item.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, name: true }
        });

        const topProducts = topItems.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
                id: item.productId,
                name: product ? product.name : 'Produk Dihapus',
                totalSold: item._sum.qty || 0,
                totalRevenue: item._sum.subtotal ? Number(item._sum.subtotal) : 0
            };
        });

        return {
            categoriesCount,
            productsCount,
            transactionsCount,
            totalRevenue: revenueAggregation._sum.total ? Number(revenueAggregation._sum.total) : 0,
            recentTransactions,
            topProducts
        };
    },

    getKasirDashboard: async (userId) => {
        const id = Number(userId);

        const [
            transactionsCount,
            revenueAggregation,
            recentTransactions
        ] = await Promise.all([
            prisma.transaction.count({ where: { userId: id } }),
            prisma.transaction.aggregate({
                _sum: { total: true },
                where: { userId: id }
            }),
            prisma.transaction.findMany({
                where: { userId: id },
                take: 10,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    total: true,
                    paymentStatus: true,
                    createdAt: true
                }
            })
        ]);

        return {
            myTransactionsCount: transactionsCount,
            myRevenue: revenueAggregation._sum.total ? Number(revenueAggregation._sum.total) : 0,
            myRecentTransactions: recentTransactions
        };
    }
};

module.exports = dashboardService;