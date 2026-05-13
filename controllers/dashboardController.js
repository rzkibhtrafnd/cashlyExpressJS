const dashboardService = require('../services/dashboardService');
const asyncHandler = require('../middlewares/asyncHandler');

const dashboardController = {
    index: asyncHandler(async (req, res) => {
        const userRole = req.user.role;
        const userId = req.user.id;

        let data = {};

        if (userRole === 'admin') {
            data = await dashboardService.getAdminDashboard();
        } else {
            data = await dashboardService.getKasirDashboard(userId);
        }

        res.json({
            status: true,
            message: 'Data dashboard berhasil diambil',
            role: userRole,
            data: data
        });
    })
};

module.exports = dashboardController;