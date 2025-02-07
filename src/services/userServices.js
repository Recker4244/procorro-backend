const users = require('../models').users;

const getAllUsersService = async () => {
  const usersData = await users.findAll();
  return usersData;
};

module.exports =
  getAllUsersService
;