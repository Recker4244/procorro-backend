// models/ordertrackingevent.js
"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderTrackingEvent extends Model {
    static associate(models) {
      OrderTrackingEvent.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
      });
    }
  }
  OrderTrackingEvent.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      order_id: DataTypes.UUID,
      status: DataTypes.STRING,
      timestamp: DataTypes.DATE,
      remarks: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "OrderTrackingEvent",
    }
  );
  return OrderTrackingEvent;
};
