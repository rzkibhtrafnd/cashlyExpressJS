const prisma = require('../config/database');
const fs = require('fs');
const path = require('path');

const settingService = {
    getSetting: async () => {
        let setting = await prisma.setting.findUnique({
            where: { id: 1 }
        });

        if (!setting) {
            return {};
        }
        return setting;
    },

    updateSetting: async (data) => {
        const { companyName, email, phone, address, wifi, wifiPassword, imgLogo, imgQris } = data;

        const existingSetting = await prisma.setting.findUnique({ where: { id: 1 } });

        const deleteOldImage = (oldImageName) => {
            if (oldImageName) {
                const imagePath = path.join(__dirname, '../public/uploads', oldImageName);
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            }
        };

        if (imgLogo && existingSetting?.imgLogo) {
            deleteOldImage(existingSetting.imgLogo);
        }

        if (imgQris && existingSetting?.imgQris) {
            deleteOldImage(existingSetting.imgQris);
        }

        const upsertData = {
            companyName: companyName || existingSetting?.companyName || null,
            email: email || existingSetting?.email || null,
            phone: phone || existingSetting?.phone || null,
            address: address || existingSetting?.address || null,
            wifi: wifi || existingSetting?.wifi || null,
            wifiPassword: wifiPassword || existingSetting?.wifiPassword || null,
            imgLogo: imgLogo || existingSetting?.imgLogo || null,
            imgQris: imgQris || existingSetting?.imgQris || null
        };

        return await prisma.setting.upsert({
            where: { id: 1 },
            update: upsertData,
            create: {
                id: 1,
                ...upsertData
            }
        });
    }
};

module.exports = settingService;