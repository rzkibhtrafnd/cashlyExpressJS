const transactionService = require('../services/transactionService');
const asyncHandler = require('../middlewares/asyncHandler');

const transactionController = {
    index: asyncHandler(async (req, res) => {
        const { month, year, page } = req.query;
        const result = await transactionService.getAll(req.user, month, year, page);
        res.json({ status: true, message: 'Data transaksi berhasil diambil', ...result });
    }),

    store: asyncHandler(async (req, res) => {
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
    }),

    show: asyncHandler(async (req, res) => {
        const transaction = await transactionService.show(req.params.id, req.user);
        res.json({ status: true, message: 'Detail transaksi berhasil diambil', data: transaction });
    }),

    report: asyncHandler(async (req, res) => {
        const { month, year } = req.query;

        const transactions = await transactionService.report(month, year);
        res.json({ status: true, message: 'Laporan transaksi berhasil diambil', data: transactions });
    })
};

module.exports = transactionController;