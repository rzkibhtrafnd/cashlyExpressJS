const transactionService = require('../services/transactionService');

const transactionController = {
    index: async (req, res) => {
        const { month, year, page } = req.query;// req.user berisi data user yang login (dari middleware verifyToken)
        const result = await transactionService.getAll(req.user, month, year, page);
        res.json({ status: true, message: 'Data transaksi berhasil diambil', ...result });
    },

    store: async (req, res) => {
        const data = {
            cart: req.body.cart,
            paymentMethod: req.body.paymentMethod
        };

        const transaction = await transactionService.store(req.user.id, data);
        res.status(201).json({ 
            status: true, 
            message: 'Transaksi berhasil disimpan', 
            data: transaction 
        });
    },

    show: async (req, res) => {
        const transaction = await transactionService.show(req.params.id, req.user);
        res.json({ status: true, message: 'Detail transaksi berhasil diambil', data: transaction });
    },

    report: async (req, res) => {
        const { month, year } = req.query;
        const transactions = await transactionService.report(month, year);
        res.json({ status: true, message: 'Laporan transaksi berhasil diambil', data: transactions });
    }
};

module.exports = transactionController;