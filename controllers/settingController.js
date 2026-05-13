const settingService = require('../services/settingService');
const asyncHandler = require('../middlewares/asyncHandler');

const settingController = {
    get: asyncHandler(async (req, res) => {
        const setting = await settingService.getSetting();
        res.json({ status: true, message: 'Data pengaturan berhasil diambil', data: setting });
    }),

    update: asyncHandler(async (req, res) => {
        const imgLogo = req.files?.['imgLogo']?.[0]?.filename;
        const imgQris = req.files?.['imgQris']?.[0]?.filename;

        const setting = await settingService.updateSetting({
            ...req.body,
            imgLogo,
            imgQris
        });

        res.json({ status: true, message: 'Pengaturan berhasil disimpan', data: setting });
    })
};

module.exports = settingController;