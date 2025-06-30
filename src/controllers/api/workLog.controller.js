const {
  createOrUpdateWorkLog,
  getUserWorkLogsByDate,
} = require('../../services/workLog.service');
const { successResponse, errorResponse } = require('../../utils/response');

module.exports = {
  createOrUpdateWorkLog: async (req, res) => {
    try {
      const userId = req.user.id;
      const workLogData = req.body;
      const workLog = await createOrUpdateWorkLog(userId, workLogData);

      return successResponse({
        res,
        status: 200,
        message: 'Cập nhật thành công',
        data: workLog,
      });
    } catch (error) {
      return errorResponse({
        res,
        status: error.status || 500,
        message: error.message || 'Lỗi khi cập nhật công việc',
      });
    }
  },

  getUserWorkLogsByDate: async (req, res) => {
    try {
      const userId = req.user.id;
      const { date } = req.query;
      const logs = await getUserWorkLogsByDate(userId, date);

      return successResponse({
        res,
        status: 200,
        message: 'Lấy nhật ký công việc thành công',
        data: logs,
      });
    } catch (error) {
      return errorResponse({
        res,
        status: error.status || 500,
        message: error.message || 'Lỗi khi lấy nhật ký công việc',
      });
    }
  },
};
