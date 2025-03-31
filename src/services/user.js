const hashPass = require("../utils/hashPass");
const user = require("../models").User;

const getAllUsers = async () => {
  const users = await user.findAll();
  return users;
};
const createUser = async (name, email, password, phone, designation, company_id) => {
  const hashedPassword = await hashPass(password);
  const newUser = await user.create({
    name,
    email,
    password:hashedPassword,
    phone,
    designation,
    company_id,
  });
  return newUser;
};

const editUser = async (id, name, email, phone, designation, company_id) => {
  const newUser = await user.update(
    {
      name,
      email,
      phone,
      designation,
      company_id,
    },
    {
      where: {
        id,
      },
    }
  );
  return newUser;
};

module.exports = { getAllUsers, createUser, editUser };
