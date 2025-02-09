const hashPass = require("../utils/hashPass");
const db = require("../models");
const { UniqueConstraintError } = require("sequelize");
const HttpErrors = require("../../errors/httpErrors");

const createUser = async (username, name, email, phoneno, role, password) => {
  try {
    const userData = {
      username: username,
      name: name,
      email: email,
      phoneno: phoneno,
      role: role,
    };
    const encryptedPassword = await hashPass(password);
    const userDetails = await db.users.create(userData);
    await db.credentials.create({
      username: username,
      password: encryptedPassword,
    });
    return userDetails;
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      console.log("Error");
      throw new HttpErrors("Username already exists", 400);
    }
    throw new HttpErrors("Internal server error", 500);
  }
};
const updateUser = async (
  id,
  username,
  name,
  email,
  phoneno,
  role,
  github,
  flag
) => {
  if (!db.users.findOne({ where: { id: id } }))
    throw new HttpErrors("User not found", 400);
  const userData = {
    username: username,
    name: name,
    email: email,
    phoneno: phoneno,
    role: role,
    github: github,
    flag: flag,
  };
  await db.users.update(userData, { where: { id: id } });
  const user = await db.users.findOne({ where: { id: id } });
  return user;
};

const getUsers = async (page, size) => {
  page--;
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  const users = await db.users.findAndCountAll({
    offset: offset,
    limit: limit,
    order: [["updatedAt", "DESC"]],
  });
  return users;
};

const getUser = async (username) => {
  const user = await db.users.findOne({ where: { username: username } });
  return user;
};

module.exports = { createUser, updateUser, getUsers, getUser };
