module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [
      {
        name: 'John',
        petName: 'cat',
        favouriteColor: 'black',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },
  down: (queryInterface, Sequelize) =>
    queryInterface.bulkDelete('users', null, {}),
}
