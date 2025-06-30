'use strict';

const { hashPassword } = require('../../utils/hash');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        email: 'admin@gmail.com',
        password: hashPassword('12345678'),
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'director',
        email: 'director@gmail.com',
        password: hashPassword('12345678'),
        role: 'director',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: 'staff',
        email: 'staff@gmail.com',
        password: hashPassword('12345678'),
        role: 'staff',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null);
  },
};
