'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Quotations', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      rfqId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'RFQs',
          key: 'id'
        },
        allowNull: false,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      // supplierId: {
      //   type: Sequelize.UUID,
      //   references: {
      //     model: 'Suppliers',
      //     key: 'id'
      //   },
      //   allowNull: false,
      //   onDelete: 'CASCADE',
      // },
      supplierName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      // price: {
      //   type: Sequelize.DECIMAL,
      //   allowNull: false
      // },
      // totalCost: {
      //   type: Sequelize.DECIMAL,
      //   allowNull: true
      // },
      deliveryTimeWeeks: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      paymentTerms: {
        type: Sequelize.ENUM('Advanced', 'Credit'),
        allowNull: false
      },
      // ranking: {
      //   type: Sequelize.STRING,
      //   allowNull: true
      // }, // e.g. L1, L2, L3
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
    await queryInterface.dropTable('Quotations');
  },
};
