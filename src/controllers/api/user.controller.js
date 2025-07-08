const {getUsers, createUser, updateUser, deleteUser} = require('../../services/user.service');
const {successResponse, errorResponse} = require('../../utils/response');

module.exports = {
    getAllUsers: async (req, res) => {
        try {
            const users = await getUsers();

            return successResponse({
                res,
                status: 200,
                message: 'Lấy danh sách người dùng thành công',
                data: users,
            });
        } catch (error) {
            return errorResponse({
                res,
                status: error.status || 500,
                message: error.message || 'Lỗi khi lấy danh sách người dùng',
            });
        }
    },

    createUser: async (req, res) => {
        try {
            const user = await createUser(req.body);

            return successResponse({
                res,
                status: 201,
                message: 'Tạo người dùng thành công',
                data: user,
            });
        } catch (error) {
            return errorResponse({
                res,
                status: error.status || 500,
                message: error.message || 'Lỗi khi tạo người dùng',
            });
        }
    },

    updateUser: async (req, res) => {
        try {
            const user = await updateUser(req.params.id, req.body);

            return successResponse({
                res,
                status: 200,
                message: 'Cập nhật người dùng thành công',
                data: user,
            });
        } catch (error) {
            return errorResponse({
                res,
                status: error.status || 500,
                message: error.message || 'Lỗi khi cập nhật người dùng',
            });
        }
    },

    deleteUser: async (req, res) => {
        try {
            await deleteUser(req.params.id);

            return successResponse({
                res,
                status: 200,
                message: 'Xoá người dùng thành công',
            });
        } catch (error) {
            return errorResponse({
                res,
                status: error.status || 500,
                message: error.message || 'Lỗi khi xoá người dùng',
            });
        }
    },
};
