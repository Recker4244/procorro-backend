"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrderItem.belongsTo(models.QuotationItem, {
        foreignKey: "quotation_item_id",
        as: "quotationItem",
      });
      OrderItem.belongsTo(models.Order, {
        foreignKey: "order_id",
        as: "order",
      });
    }
  }
  OrderItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      description: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      unit_price: DataTypes.INTEGER,
      delivery_time_weeks: DataTypes.INTEGER,
      paymentTerms: {
        type: DataTypes.ENUM("Advanced", "Credit"),
        allowNull: true,
      },
      order_id: {
        type: DataTypes.UUID,
        references: {
          model: "Orders", // name of the target table
          key: "id", // key in the target table that we're referencing
        },
      },
      quotation_item_id: { // reference to QuotationItem
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "QuotationItems",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "OrderItem",
    }
  );
  OrderItem.beforeCreate((orderitem) => {
    orderitem.id = uuidv4();
  });
  return OrderItem;
};
