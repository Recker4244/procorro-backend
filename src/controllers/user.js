const httpErrors = require('http-errors');
const userService = require('../services/user');

const getAllUsers = async (req, res) => {
  try {
    const userData = await userService.getAllUsers();
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

const createUser = async (req, res) => {
  try {
    const {name, email, phone, designation, company_id } = req.body;
    const newUser = await userService.createUser(name, email, phone, designation, company_id);
    res.status(201).json(newUser);
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

module.exports = {getAllUsers,createUser};