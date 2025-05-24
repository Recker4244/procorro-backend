"use strict";
const { Model } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  class Rfq extends Model {
    static associate(models) {
      // An RFQ belongs to a single Project
      Rfq.belongsTo(models.Project, {
        foreignKey: "projectId",
        as: "project",
      });
      Rfq.hasMany(models.RfqItem, {
        foreignKey: "rfqId",
        as: "items",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }

  Rfq.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Projects",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deliveryLocation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      preferredDeliveryDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "Draft",
      },
    },
    {
      sequelize,
      modelName: "Rfq",
      tableName: "RFQs", // explicitly match the migration table name
    }
  );

  // Rfq.beforeCreate((rfq) => {
  //   rfq.id = uuidv4();
  // });

  return Rfq;
};
