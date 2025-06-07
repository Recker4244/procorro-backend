"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Quotation extends Model {
    static associate(models) {
      Quotation.belongsTo(models.Rfq, {
        foreignKey: "rfqId",
        as: "rfq",
      });
      // Uncomment if supplier association is required in future
      // Quotation.belongsTo(models.Supplier, {
      //   foreignKey: "supplierId",
      //   as: "supplier",
      // });
      Quotation.hasMany(models.QuotationItem, {
        foreignKey: "quotationId",
        as: "quotationItems",
      });
    }
  }

  Quotation.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      rfqId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "RFQs",
          key: "id",
        },
      },
      company_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Companies",
          key: "id"
        }
      },
      supplierName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // supplierId: {
      //   type: DataTypes.UUID,
      //   allowNull: false,
      //   references: {
      //     model: "Suppliers",
      //     key: "id",
      //   },
      // },
      deliveryTimeWeeks: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      paymentTerms: {
        type: DataTypes.ENUM("Advanced", "Credit"),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Open for evaluation", "Closed", "Pending", "Submitted"),
        defaultValue: "Open for evaluation",
      },
    },
    {
      sequelize,
      modelName: "Quotation",
    }
  );

  Quotation.beforeCreate((quotation) => {
    quotation.id = uuidv4();
  });

  return Quotation;
};
