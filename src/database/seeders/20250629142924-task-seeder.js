'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tasks', [
      {
        name: 'Phát triển thuê bao',
        code: 'PTTB',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Tiếp thị',
        code: 'TT',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Hỗ trợ trực tiếp',
        code: 'HTTT',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Chăm sóc khách hàng',
        code: 'CSKH',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Gia hạn thanh toán',
        code: 'GHTT',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Xử lý suy hao',
        code: 'XLSH',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Xác minh',
        code: 'XM',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tasks', null);
  },
};
