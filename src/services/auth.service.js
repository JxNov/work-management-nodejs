const { User } = require('../models/index');

module.exports = {
  getUserByEmail: async (email) => {
    try {
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        const error = new Error('Unauthorize');
        error.status = 401;
        throw error;
      }

      return user;
    } catch (error) {
      throw error;
    }
  },
};
