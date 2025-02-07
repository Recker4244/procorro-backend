const adminService = require('../services/admin');
const httpErrors = require('../../errors/httpErrors');

const createUser = async (request, response) => {
  try {
    const {
      name,
      email,
      phoneno,
      role,
    } = request.body;
    const username = name.replace(/\s/g, '').toLowerCase();
    const newUser = await adminService.createUser(
      username,
      name,
      email,
      phoneno,
      role,
    );
    return response.status(201).json(newUser);
  } catch (error) {
    if (error instanceof httpErrors) {
      return response.status(error.code).json({ message: error.message });
    }
    return response.status(500).json({ status: 500, message: error.message });
  }
};
const updateUser = async (request, response) => {
  try {
    const {
      id,
      username,
      name,
      email,
      phoneno,
      role,
    } = request.body;
    const newUser = await adminService.updateUser(
      id,
      username,
      name,
      email,
      phoneno,
      role,
    );
    return response.status(200).json(newUser);
  } catch (error) {
    if (error instanceof httpErrors) {
      return response.status(error.code).json({ message: error.message });
    }
    return response.status(500).json(error.message);
  }
};


const getUsers = async (request, response) => {
  try {
    const { page, limit } = request.query;
    const users = await adminService.getUsers(page, limit);
    return response.status(200).json(users);
  } catch (error) {
    if (error instanceof httpErrors) {
      return response.status(error.code).json({ message: error.message });
    }
    return response.status(500).json(error.message);
  }
};

const getUser = async (request, response) => {
  try {
    const { username } = request.params;
    const user = await adminService.getUser(username);
    response.status(200).json(user);
  } catch (error) {
    response.status(500).json(error.message);
  }
};

module.exports = { createUser, updateUser, getUsers, getUser };
