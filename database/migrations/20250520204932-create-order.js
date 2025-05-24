"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      type_of_items: {
        type: Sequelize.STRING,
      },
      date_of_generation: {
        type: Sequelize.DATE,
      },
      po_id: {
        type: Sequelize.STRING,
      },
      delivery_address: {
        type: Sequelize.STRING,
      },
      point_of_contact: {
        type: Sequelize.STRING,
      },
      point_of_contactphone: {
        type: Sequelize.STRING,
      },
      notes: {
        type: Sequelize.STRING,
      },
      terms_and_conditions: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Orders");
  },
};
