"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Items", [
      {
        location: "Europe",
        cost: "5000",
        bywhen: "01/10/2024",
        name: "Backpacking",
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        location: "Hawaii",
        cost: "7000",
        bywhen: "02/20/2025",
        name: "Deep Sea Diving",
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        location: "Canada",
        cost: "2000",
        bywhen: "03/30/2025",
        name: "Selfie with Mounties",
        userId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
