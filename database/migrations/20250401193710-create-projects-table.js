"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Projects", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      project_name: {
        type: Sequelize.STRING,
      },
      project_location: {
        type: Sequelize.STRING,
      },
      siteInchargeName: {
        type: Sequelize.STRING,
      },
      siteInchargeNumber: {
        type: Sequelize.STRING,
      },
      approvedBrands: {
        type: Sequelize.STRING,
      },
      company_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Companies",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      project_type: {
        type: Sequelize.STRING,
      },
      workType: {
        type: Sequelize.STRING,
      },
      governmentDepartmentName: {
        type: Sequelize.STRING,
      },
      privateDepartmentClient: {
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
    await queryInterface.dropTable("Projects");
  },
};
