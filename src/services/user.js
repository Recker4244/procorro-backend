const hashPass = require("../utils/hashPass");
const UserModel = require("../models").User;
const CompanyModel = require("../models").Company;
const bcrypt = require("bcryptjs");
const { validate: isUuid } = require('uuid');
const HttpErrors = require("../../errors/httpErrors");

const getAllUsers = async () => {
  const users = await UserModel.findAll();
  return users;
};

const loginUser = async (email, password) => {
  const user = await UserModel.findOne({
    where: {
      email: email,
    },
  });
  console.log("Found user:", user);
  if (!user) throw new HttpErrors("Invalid email or password", 400);
  const validPassword = await bcrypt.compare(
    password,
    user.dataValues.password
  );

  if (!validPassword) throw new HttpErrors("Invalid email or password", 400);

  return user;
};

const createUser = async (
  name,
  email,
  password,
  phone,
  designation,
  company_id
) => {
  const user = await UserModel.findOne({
    where: {
      email: email,
    },
  });
  if (!isUuid(company_id)) {
    throw new HttpErrors("Invalid company ID format", 400);
  }
  const company = await CompanyModel.findOne({
    where: { id: company_id },
  });
  if (!company) {
    throw new HttpErrors("Company ID does not exist", 400);
  }
  if (user) {
    const error = new Error("User already registered with this email");
    error.statusCode = 400;
    throw error;
  }
  const hashedPassword = await hashPass(password);
  const newUser = await UserModel.create({
    name,
    email,
    password: hashedPassword,
    phone,
    designation,
    company_id,
  });
  return newUser;
};

const editUser = async (id, name, email, phone, designation, company_id) => {
  const newUser = await UserModel.update(
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

module.exports = { getAllUsers, createUser, editUser, loginUser };
