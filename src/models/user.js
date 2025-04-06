"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Company, {
        foreignKey: "company_id",
        as: "company",
      });
      User.hasMany(models.Order, {
        foreignKey: "creator_id",
        as: "orders",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      designation: DataTypes.STRING,
      company_id: {
        type: DataTypes.UUID,
        references: {
          model: "Companies", // name of the target table
          key: "id", // key in the target table that we're referencing
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeCreate((user) => {
    user.id = uuidv4();
  });
  return User;
};
