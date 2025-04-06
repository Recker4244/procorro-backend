"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Company.hasMany(models.User, {
        foreignKey: "company_id",
        as: "users",
      });
      Company.hasMany(models.Order, {
        foreignKey: "company_id",
        as: "orders",
      });
    }
  }
  Company.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      gst: DataTypes.STRING,
      company_type: {
        type: DataTypes.ENUM,
        values: ["Supplier", "Buyer"],
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Company",
    }
  );
  Company.beforeCreate((company) => {
    company.id = uuidv4();
  });
  return Company;
};
