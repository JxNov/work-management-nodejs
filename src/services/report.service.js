const { DailyWorkLog } = require('../models');

module.exports = {
  getDailySummary: async (date) => {
    try {
      const logs = await DailyWorkLog.findAll({
        where: { date },
        include: ['users', 'tasks'],
      });

      const result = {};

      if (!logs || logs.length === 0) {
        const error = new Error('No work logs found for this date');
        error.status = 404;
        throw error;
      }

      logs.forEach((log) => {
        const userId = log.users.id;
        if (!result[userId]) {
          result[userId] = {
            username: log.users.username,
            total: 0,
            logs: [],
          };
        }
        result[userId].total += log.quantity;
        result[userId].logs.push({
          date: log.date,
          task: log.tasks.name,
          quantity: log.quantity,
        });
      });

      return Object.values(result);
    } catch (error) {
      throw error;
    }
  },
};
