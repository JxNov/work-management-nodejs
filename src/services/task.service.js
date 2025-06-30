const {Task} = require('../models');

module.exports = {
    getAllTasks: async () => {
        try {
            const tasks = await Task.findAll({
                attributes: ['id', 'code', 'name'],
            });

            if (!tasks || tasks.length === 0) {
                const error = new Error('No tasks found');
                error.status = 404;
                throw error;
            }

            return tasks;
        } catch (error) {
            throw error;
        }
    },

    createTask: async (taskData) => {
        try {
            const {code, name} = taskData;
            const task = await Task.create({code, name});

            if (!task) {
                const error = new Error('Task creation failed');
                error.status = 500;
                throw error;
            }

            return await Task.findByPk(task.id, {
                attributes: ['id', 'code', 'name'],
            });
        } catch (error) {
            throw error;
        }
    },
};
