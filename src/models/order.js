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
      Order.hasMany(models.OrderItem, {
        foreignKey: "order_id",
        as: "order_items",
      });
      Order.hasMany(models.OrderTrackingEvent, { as: 'tracking_events', foreignKey: 'order_id' });
    }
  }
  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type_of_items: DataTypes.STRING,
      date_of_generation: DataTypes.DATE,
      po_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true,
        allowNull: false,
      },
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
