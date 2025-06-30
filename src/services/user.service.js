const { User } = require('../models/index');
const { Op } = require('sequelize');
module.exports = {
  getUsers: async (_order, _sort, _limit, _page, q) => {
    try {
      const offset = (_page - 1) * _limit;
      const where = {};
      if (q) {
        where[Op.or] = {
          fullname: {
            [Op.iLike]: `%${q}%`,
          },
          email: {
            [Op.iLike]: `%${q}%`,
          },
        };
      }
      return User.findAndCountAll({
        order: [[_sort, _order]],
        limit: _limit,
        offset,
        where,
      });
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
};
