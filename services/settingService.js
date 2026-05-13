const prisma = require('../config/database');
const fs = require('fs').promises;
const path = require('path');

const settingService = {
    getSetting: async () => {
        const setting = await prisma.setting.findUnique({ where: { id: 1 } });
        return setting || {};
    },

    updateSetting: async (data) => {
        const existing = await prisma.setting.findUnique({ where: { id: 1 } });

        const updateData = {
            companyName: data.companyName ?? existing?.companyName,
            email: data.email ?? existing?.email,
            phone: data.phone ?? existing?.phone,
            address: data.address ?? existing?.address,
            wifi: data.wifi ?? existing?.wifi,
            wifiPassword: data.wifiPassword ?? existing?.wifiPassword,
            imgLogo: data.imgLogo ?? existing?.imgLogo,
            imgQris: data.imgQris ?? existing?.imgQris
        };

        const result = await prisma.setting.upsert({
            where: { id: 1 },
            update: updateData,
            create: { id: 1, ...updateData }
        });

        const uploadDir = path.join(__dirname, '../public/uploads');
        
        if (data.imgLogo && existing?.imgLogo && data.imgLogo !== existing.imgLogo) {
            await fs.unlink(path.join(uploadDir, existing.imgLogo)).catch(() => null);
        }
        if (data.imgQris && existing?.imgQris && data.imgQris !== existing.imgQris) {
            await fs.unlink(path.join(uploadDir, existing.imgQris)).catch(() => null);
        }

        return result;
    }
};

module.exports = settingService;