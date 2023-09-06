"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Users", [
      {
        firstname: "Angela",
        lastname: "Apples",
        email: "ApplesAng@email.com",
        username: "apls2apls",
        password: "testpass",
        age: "22",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: "Bobert",
        lastname: "Buccees",
        email: "BobBuilder@email.com",
        username: "engnear@email.com",
        password: "dummypass",
        age: "26",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstname: "Cory",
        lastname: "Charles",
        email: "2Firstnames@email.com",
        username: "corychuck",
        password: "secretpass",
        age: "32",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
