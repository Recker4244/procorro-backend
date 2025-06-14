"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OrderItems", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      description: {
        type: Sequelize.STRING,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      unit_price: {
        type: Sequelize.INTEGER,
      },
      delivery_time_weeks: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      paymentTerms: {
        type: Sequelize.ENUM('Advanced', 'Credit'),
        allowNull: true,
      },
      quotation_item_id: { // NEW: trace to QuotationItem
        type: Sequelize.UUID,
        references: {
          model: "QuotationItems",
          key: "id",
        },
      },
      order_id: {
        type: Sequelize.UUID,
        references: {
          model: "Orders", // name of the target table
          key: "id", // key in the target table that we're referencing
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("OrderItems");
  },
};
