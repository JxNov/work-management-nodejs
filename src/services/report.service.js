const {DailyWorkLog} = require('../models');
const {Op} = require('sequelize');
const {checkKpiStandard} = require("./standard.service");

module.exports = {
    getDailySummary: async (query) => {
        try {
            const {date, username} = query;
            const logs = await DailyWorkLog.findAll({
                where: {
                    date: {
                        [Op.eq]: date || new Date().toISOString().split('T')[0],
                    },
                    ...(username && {
                        '$users.username$': {
                            [Op.like]: `%${username}%`,
                        },
                    }),
                },
                include: ['users', 'tasks'],
            });

            const result = {};

            if (!logs || logs.length === 0) {
                const error = new Error('No work logs found for this date');
                error.status = 404;
                throw error;
            }

            for (const log of logs) {
                const userId = log.users.id;
                if (!result[userId]) {
                    result[userId] = {
                        username: log.users.username,
                        total: 0,
                        logs: [],
                    };
                }
                result[userId].total += log.quantity;
                const isEnough = await checkKpiStandard(log.tasks.id, log.quantity);
                result[userId].logs.push({
                    date: log.date,
                    task: log.tasks.name,
                    quantity: log.quantity,
                    isEnough: isEnough,
                });
            }

            return Object.values(result);
        } catch (error) {
            throw error;
        }
    },
};
