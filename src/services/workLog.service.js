const { DailyWorkLog, User, Task } = require('../models');

module.exports = {
  createOrUpdateWorkLog: async (userId, workLogData) => {
    try {
      const { taskId, date, quantity } = workLogData;

      const [workLog, created] = await DailyWorkLog.findOrCreate({
        where: { user_id: userId, task_id: taskId, date },
        defaults: { quantity },
      });

      if (!created) {
        workLog.quantity = quantity;
        await workLog.save();
      }

      if (!workLog) {
        const error = new Error('Failed to create or update work log');
        error.status = 400;
        throw error;
      }

      const finalLog = await DailyWorkLog.findByPk(workLog.id, {
        attributes: ['date', 'quantity'],
        include: [
          {
            model: User,
            as: 'users',
            attributes: ['username'],
          },
          {
            model: Task,
            as: 'tasks',
            attributes: ['code', 'name'],
          },
        ],
      });

      return finalLog;
    } catch (error) {
      throw error;
    }
  },

  getUserWorkLogsByDate: async (userId, date) => {
    try {
      const logs = await DailyWorkLog.findAll({
        where: { user_id: userId, date },
        attributes: ['date', 'quantity'],
        include: [
          {
            model: User,
            as: 'users',
            attributes: ['username'],
          },
          {
            model: Task,
            as: 'tasks',
            attributes: ['code', 'name'],
          },
        ],
      });

      if (!logs || logs.length === 0) {
        const error = new Error('No work logs found for this date');
        error.status = 404;
        throw error;
      }

      return logs;
    } catch (error) {
      throw error;
    }
  },
};
