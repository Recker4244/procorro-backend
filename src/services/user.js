const user = require("../models").users;

const getAllUsers = async () => {
  const users = await user.findAll();
  return users;
};
const createUser = async (name, email, phone, designation, company_id) => {
  const newUser = await user.create({
    name,
    email,
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
