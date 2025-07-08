const {TaskStandard, Task} = require('../models');

module.exports = {
    getAllStandards: async () => {
        try {
            const standards = await TaskStandard.findAll({
                attributes: ['id', 'daily_minimum'],
                include: [
                    {
                        model: Task,
                        as: 'tasks',
                        attributes: ['id', 'code', 'name'],
                    },
                ],
            });

            if (!standards || standards.length === 0) {
                const error = new Error('No task standards found');
                error.status = 404;
                throw error;
            }

            return standards.map((standard) => {
                return {
                    id: standard.id,
                    dailyMinimum: standard.daily_minimum,
                    task: {
                        id: standard.tasks.id,
                        code: standard.tasks.code,
                        name: standard.tasks.name,
                    },
                };
            });
        } catch (error) {
            throw error;
        }
    },

    setStandard: async (taskId, dailyMinimum) => {
        try {
            const [standard, created] = await TaskStandard.findOrCreate({
                where: {task_id: taskId},
                defaults: {daily_minimum: dailyMinimum},
            });

            if (!created) {
                standard.daily_minimum = dailyMinimum;
                await standard.save();
            }

            if (!standard) {
                const error = new Error('Failed to create or update task standard');
                error.status = 400;
                throw error;
            }

            const finalStandard = await TaskStandard.findByPk(standard.id, {
                attributes: ['id', 'daily_minimum'],
                include: [
                    {
                        model: Task,
                        as: 'tasks',
                        attributes: ['code', 'name'],
                    },
                ],
            });

            return {
                id: finalStandard.id,
                dailyMinimum: finalStandard.daily_minimum,
                task: {
                    code: finalStandard.tasks.code,
                    name: finalStandard.tasks.name,
                },
            };
        } catch (error) {
            throw error;
        }
    },

    deleteStandard: async (id) => {
        try {
            const standard = await TaskStandard.findByPk(id);
            if (!standard) {
                const error = new Error('Task standard not found');
                error.status = 404;
                throw error;
            }
            await standard.destroy();
            return {message: 'Task standard deleted successfully'};
        } catch (error) {
            throw error;
        }
    },

    checkKpiStandard: async (taskId, quantity) => {
        try {
            const standards = await TaskStandard.findAll({
                where: {task_id: taskId},
                include: ['tasks'],
            });

            return standards.some(standard => {
                const {daily_minimum} = standard;
                return quantity >= daily_minimum;
            });
        } catch (error) {
            throw error;
        }
    },
};
