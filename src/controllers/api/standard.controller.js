const {
    getAllStandards,
    setStandard,
    deleteStandard
} = require('../../services/standard.service');
const {successResponse, errorResponse} = require('../../utils/response');

module.exports = {
    getAllStandards: async (req, res) => {
        try {
            const standards = await getAllStandards();

            return successResponse({
                res,
                status: 200,
                message: 'Lấy danh sách tiêu chuẩn thành công',
                data: standards,
            });
        } catch (error) {
            return errorResponse({
                res,
                status: error.status || 500,
                message: error.message || 'Lỗi khi lấy danh sách tiêu chuẩn',
            });
        }
    },

    setStandard: async (req, res) => {
        try {
            const {taskId, dailyMinimum} = req.body;
            const standard = await setStandard(taskId, dailyMinimum);

            return successResponse({
                res,
                status: 200,
                message: 'Cập nhật tiêu chuẩn thành công',
                data: standard,
            });
        } catch (error) {
            return errorResponse({
                res,
                status: error.status || 500,
                message: error.message || 'Lỗi khi cập nhật tiêu chuẩn',
            });
        }
    },

    deleteStandard: async (req, res) => {
        try {
            const {id} = req.params;
            await deleteStandard(id);

            return successResponse({
                res,
                status: 200,
                message: 'Xoá tiêu chuẩn thành công',
            });
        } catch (error) {
            return errorResponse({
                res,
                status: error.status || 500,
                message: error.message || 'Lỗi khi xoá tiêu chuẩn',
            });
        }
    }
};
