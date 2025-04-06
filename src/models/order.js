"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Company, {
        foreignKey: "company_id",
        as: "company",
      });
      Order.belongsTo(models.User, {
        foreignKey: "creator_id",
        as: "creator",
      });
      Order.hasMany(models.OrderItem, {
        foreignKey: "order_id",
        as: "order_items",
      });
    }
  }
  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      company_id: {
        type: DataTypes.UUID,
        references: {
          model: "Companies", // name of the target table
          key: "id", // key in the target table that we're referencing
        },
      },
      creator_id: {
        type: DataTypes.UUID,
        references: {
          model: "Users", // name of the target table
          key: "id", // key in the target table that we're referencing
        },
      },
      type_of_items: DataTypes.STRING,
      date_of_generation: DataTypes.STRING,
      po_id: DataTypes.STRING,
      delivery_address: DataTypes.STRING,
      point_of_contact: DataTypes.STRING,
      point_of_contactphone: DataTypes.STRING,
      notes: DataTypes.STRING,
      terms_and_conditions: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  Order.beforeCreate((order) => {
    order.id = uuidv4();
  });
  return Order;
};
