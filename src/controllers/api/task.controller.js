const {getAllTasks, createTask, updateTask, deleteTask} = require('../../services/task.service');
const {successResponse, errorResponse} = require('../../utils/response');

module.exports = {
    getAllTasks: async (req, res) => {
        try {
            const tasks = await getAllTasks();

            return successResponse({
                res,
                status: 200,
                message: 'Lấy danh sách công việc thành công',
                data: tasks,
            });
        } catch (error) {
            return errorResponse({
                res,
                status: error.status || 500,
                message: error.message || 'Lỗi khi lấy danh sách công việc',
            });
        }
    },

    createTask: async (req, res) => {
        try {
            const taskData = req.body;
            const task = await createTask(taskData);

            return successResponse({
                res,
                status: 201,
                message: 'Tạo công việc thành công',
                data: task,
            });
        } catch (error) {
            return errorResponse({
                res,
                status: error.status || 500,
                message: error.message || 'Lỗi khi tạo công việc',
            });
        }
    },

    updateTask: async (req, res) => {
        try {
            const taskId = req.params.id;
            const taskData = req.body;
            const updatedTask = await updateTask(taskId, taskData);

            return successResponse({
                res,
                status: 200,
                message: 'Cập nhật công việc thành công',
                data: updatedTask,
            });
        } catch (error) {
            return errorResponse({
                res,
                status: error.status || 500,
                message: error.message || 'Lỗi khi cập nhật công việc',
            });
        }
    },

    deleteTask: async (req, res) => {
        try {
            await deleteTask(req.params.id);

            return successResponse({
                res,
                status: 200,
                message: 'Xóa công việc thành công',
            });
        } catch (error) {
            return errorResponse({
                res,
                status: error.status || 500,
                message: error.message || 'Lỗi khi xóa công việc',
            });
        }
    }
};
