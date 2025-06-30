'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DailyWorkLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DailyWorkLog.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'users',
      });
      DailyWorkLog.belongsTo(models.Task, {
        foreignKey: 'task_id',
        as: 'tasks',
      });
    }
  }
  DailyWorkLog.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      date: DataTypes.DATEONLY,
      quantity: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'DailyWorkLog',
      tableName: 'daily_work_logs',
      timestamps: true,
      underscored: true,
    }
  );
  return DailyWorkLog;
};
