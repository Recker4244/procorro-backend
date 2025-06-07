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
      Project.hasMany(models.Rfq, {
        foreignKey: "projectId",
        as: "rfqs",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
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
      project_name: DataTypes.STRING,
      project_location: DataTypes.STRING,
      siteInchargeName: DataTypes.STRING,
      siteInchargeNumber: DataTypes.STRING,
      approvedBrands: DataTypes.STRING,
      company_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Companies", // name of the target table
          key: "id", // key in the target table that we're referencing
        },
      },
      project_type: DataTypes.STRING,
      workType: DataTypes.STRING,
      governmentDepartmentName: DataTypes.STRING,
      privateDepartmentClient: DataTypes.STRING,
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
