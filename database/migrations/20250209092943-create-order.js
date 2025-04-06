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
      company_id: {
        type: Sequelize.UUID,
        references: {
          model: "Companies", // name of the target table
          key: "id", // key in the target table that we're referencing
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      creator_id: {
        type: Sequelize.UUID,
        references: {
          model: "Users", // name of the target table
          key: "id", // key in the target table that we're referencing
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
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
