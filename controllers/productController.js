const productService = require('../services/productService');
const asyncHandler = require('../middlewares/asyncHandler');

const productController = {
    getAll: asyncHandler(async (req, res) => {
        const products = await productService.getAllProducts();
        res.json({ status: true, message: 'Daftar produk berhasil diambil', data: products });
    }),

    getById: asyncHandler(async (req, res) => {
        const product = await productService.getProductById(req.params.id);
        res.json({ status: true, message: 'Detail produk berhasil diambil', data: product });
    }),

    create: asyncHandler(async (req, res) => {
        const product = await productService.createProduct({
            categoryId: req.body.categoryId,
            name: req.body.name,
            price: req.body.price,
            image: req.file ? req.file.filename : null
        });
        res.status(201).json({ status: true, message: 'Produk berhasil ditambahkan', data: product });
    }),

    update: asyncHandler(async (req, res) => {
        const product = await productService.updateProduct(req.params.id, {
            categoryId: req.body.categoryId,
            name: req.body.name,
            price: req.body.price,
            newImage: req.file ? req.file.filename : null
        });
        res.json({ status: true, message: 'Produk berhasil diperbarui', data: product });
    }),

    delete: asyncHandler(async (req, res) => {
        await productService.deleteProduct(req.params.id);
        res.json({ status: true, message: 'Produk berhasil dihapus beserta gambarnya' });
    })
};

module.exports = productController;