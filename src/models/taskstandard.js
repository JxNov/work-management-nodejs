'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaskStandard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TaskStandard.belongsTo(models.Task, {
        foreignKey: 'task_id',
        as: 'tasks',
      });
    }
  }
  TaskStandard.init(
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      daily_minimum: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'TaskStandard',
      tableName: 'task_standards',
      timestamps: true,
      underscored: true,
    }
  );
  return TaskStandard;
};
