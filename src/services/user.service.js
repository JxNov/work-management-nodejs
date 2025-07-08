const {User} = require('../models/index');
const {hashPassword} = require("../utils/hash");

module.exports = {
    getUsers: async () => {
        try {
            const users = await User.findAll({
                attributes: ['id', 'username', 'email', 'role'],
            });

            if (!users || users.length === 0) {
                const error = new Error('No users found');
                error.status = 404;
                throw error;
            }

            return users;
        } catch (error) {
            throw error;
        }
    },

    getUser: async (id) => {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                const error = new Error('User not found');
                error.status = 404;
                throw error;
            }
            return user;
        } catch (error) {
            throw error;
        }
    },

    createUser: async (userData) => {
        try {
            const {username, email, password, role} = userData;
            const user = await User.create({
                username,
                email,
                password: hashPassword(password || '12345678'),
                role: role || 'staff',
            });

            if (!user) {
                const error = new Error('User creation failed');
                error.status = 400;
                throw error;
            }

            return user;
        } catch (error) {
            throw error;
        }
    },

    updateUser: async (id, userData) => {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                const error = new Error('User not found');
                error.status = 404;
                throw error;
            }
            const {username, email, role} = userData;

            await user.update({
                username,
                email,
                role: role || user.role,
            });
            return user;
        } catch (error) {
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                const error = new Error('User not found');
                error.status = 404;
                throw error;
            }

            await user.destroy();
            return {message: 'User deleted successfully'};
        } catch (error) {
            throw error;
        }
    },
};
