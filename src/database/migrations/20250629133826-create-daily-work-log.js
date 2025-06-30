'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('daily_work_logs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      task_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'tasks',
          key: 'id',
        },
      },
      date: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint('daily_work_logs', {
      type: 'unique',
      fields: ['user_id', 'task_id', 'date'],
      name: 'daily_work_logs_user_task_date_unique',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('daily_work_logs');
  },
};
