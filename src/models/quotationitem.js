"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class QuotationItem extends Model {
    static associate(models) {
      QuotationItem.belongsTo(models.Quotation, {
        foreignKey: "quotationId",
        as: "quotation",
      });
      QuotationItem.belongsTo(models.RfqItem, {
        foreignKey: "rfqItemId",
        as: "rfqItem",
      });
    }
  }

  QuotationItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      quotationId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Quotations",
          key: "id",
        },
      },
      rfqItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "RFQItems",
          key: "id",
        },
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      totalCost: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      deliveryTimeWeeks: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      paymentTerms: {
        type: DataTypes.ENUM("Advanced", "Credit"),
        allowNull: true,
      },
      ranking: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("Open for evaluation", "Closed", "Pending", "Submitted"),
        defaultValue: "Submitted",
      },
    },
    {
      sequelize,
      modelName: "QuotationItem",
    }
  );

  QuotationItem.beforeCreate((item) => {
    item.id = uuidv4();
  });

  return QuotationItem;
};
