const {DailyWorkLog, User, Task} = require('../models');
const {checkKpiStandard} = require("./standard.service");

module.exports = {
    createOrUpdateWorkLog: async (userId, workLogData) => {
        try {
            const {taskId, date, quantity} = workLogData;

            const [workLog, created] = await DailyWorkLog.findOrCreate({
                where: {user_id: userId, task_id: taskId, date},
                defaults: {quantity},
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

            const updatedWorkLog = await DailyWorkLog.findOne({
                where: {id: workLog.id},
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
                        attributes: ['id', 'code', 'name'],
                    },
                ],
            })

            if (!updatedWorkLog) {
                const error = new Error('Work log not found');
                error.status = 404;
                throw error;
            }

            const isEnough = await checkKpiStandard(updatedWorkLog.tasks.id, updatedWorkLog.quantity);
            return {
                id: workLog.id,
                date: updatedWorkLog.date,
                taskId: updatedWorkLog.tasks.id,
                task: updatedWorkLog.tasks.name,
                quantity: updatedWorkLog.quantity,
                isEnough: isEnough,
            };
        } catch (error) {
            throw error;
        }
    },

    getUserWorkLogsByDate: async (userId, date) => {
        try {
            const logs = await DailyWorkLog.findAll({
                where: {user_id: userId, date},
                attributes: ['id', 'date', 'quantity'],
                include: [
                    {
                        model: User,
                        as: 'users',
                        attributes: ['username'],
                    },
                    {
                        model: Task,
                        as: 'tasks',
                        attributes: ['id', 'code', 'name'],
                    },
                ],
            });

            if (!logs || logs.length === 0) {
                const error = new Error('No work logs found for this date');
                error.status = 404;
                throw error;
            }

            const result = {};

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
                    id: log.id,
                    date: log.date,
                    taskId: log.tasks.id,
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

    deleteWorkLog: async (workLogId) => {
        try {
            const workLog = await DailyWorkLog.findOne({
                where: {id: workLogId}
            });
            if (!workLog) {
                const error = new Error('Work log not found');
                error.status = 404;
                throw error;
            }

            await workLog.destroy();
            return {message: 'Work log deleted successfully'};
        } catch (error) {
            throw error;
        }
    }
};
