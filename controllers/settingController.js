const settingService = require('../services/settingService');

const settingController = {
    get: async (req, res) => {
        const setting = await settingService.getSetting();
        res.json({ status: true, message: 'Data pengaturan berhasil diambil', data: setting });
    },

    update: async (req, res) => {
        const newImgLogo = req.files && req.files['imgLogo'] ? req.files['imgLogo'][0].filename : null;
        const newImgQris = req.files && req.files['imgQris'] ? req.files['imgQris'][0].filename : null;

        const data = {
            companyName: req.body.companyName,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            wifi: req.body.wifi,
            wifiPassword: req.body.wifiPassword,
            imgLogo: newImgLogo,
            imgQris: newImgQris
        };

        const setting = await settingService.updateSetting(data);
        res.json({ status: true, message: 'Pengaturan berhasil disimpan', data: setting });
    }
};

module.exports = settingController;