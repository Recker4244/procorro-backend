'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('QuotationItems', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      quotationId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Quotations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      rfqItemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'RFQItems',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      price: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      totalCost: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      deliveryTimeWeeks: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      paymentTerms: {
        type: Sequelize.ENUM('Advanced', 'Credit'),
        allowNull: true,
      },
      ranking: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('Open for evaluation', 'Closed', 'Pending', 'Submitted'),
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
  down: async (queryInterface) => {
    await queryInterface.dropTable('QuotationItems');
  },
};
