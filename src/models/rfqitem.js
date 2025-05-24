"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class RfqItem extends Model {
    static associate(models) {
      // Each RFQItem belongs to one RFQ
      RfqItem.belongsTo(models.Rfq, {
        foreignKey: "rfqId",
        as: "rfq",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      RfqItem.hasMany(models.QuotationItem, {
        foreignKey: 'rfqItemId',
        as: 'quotationItems'
      });
    }
  }

  RfqItem.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true, 
        autoIncrement: true
      },
      rfqId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      unit: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "RfqItem",
      tableName: "RFQItems", // explicitly matches migration table name
    }
  );

  // RfqItem.beforeCreate((item) => {
  //   item.id = uuidv4();
  // });

  return RfqItem;
};
