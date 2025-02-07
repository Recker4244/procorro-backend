const httpErrors = require('http-errors');
const getAllUsersService = require('../services/userServices');

const getAllUsers = async (req, res) => {
  try {
    const userData = await getAllUsersService();
    res.status(200).json(userData);
  }
  catch (err) {
    if (err instanceof httpErrors) {
      res.status(err.code).json({ message: err.message });
    }
    else {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = getAllUsers;