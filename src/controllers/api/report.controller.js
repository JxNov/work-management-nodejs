const { getDailySummary } = require('../../services/report.service');
const { successResponse, errorResponse } = require('../../utils/response');

module.exports = {
  getDailySummary: async (req, res) => {
    try {
      const summary = await getDailySummary(req.query);

      return successResponse({
        res,
        status: 200,
        message: 'Lấy báo cáo thành công',
        data: summary,
      });
    } catch (error) {
      return errorResponse({
        res,
        status: error.status || 500,
        message: error.message || 'Lỗi khi lấy báo cáo',
      });
    }
  },
};
