"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Project.belongsTo(models.Company, {
        foreignKey: "company_id",
        as: "company",
      });
    }
  }
  Project.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      company_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Companies", // name of the target table
          key: "id", // key in the target table that we're referencing
        },
      },
      dueDate: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Project",
    }
  );
  Project.beforeCreate((project) => {
    project.id = uuidv4();
  });
  return Project;
};
