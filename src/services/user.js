const hashPass = require("../utils/hashPass");
const UserModel = require("../models").User;
const CompanyModel = require("../models").Company;
const bcrypt = require("bcryptjs");
const { validate: isUuid } = require('uuid');
const HttpErrors = require("../../errors/httpErrors");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const getUser = async (id) => {
  const user = await UserModel.findByPk(id);
  return user;
};

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

  const company = await CompanyModel.findOne({ where: { id: user.company_id } });
  const payload = {
    id: user.id,
    email: user.email,
    company_id: user.company_id,
    company_type: company.company_type,
  };

  const token = jwt.sign(payload, process.env.jwtPrivateKey, {
    expiresIn: "6h",
  });
  return { user: { ...user.toJSON(), company_type: company.company_type }, token };
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
    throw new HttpErrors("User already registered with this email", 400);
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
  const payload = {
    id: newUser.id,
    email: newUser.email,
    company_id: newUser.company_id,
    company_type: company.company_type,
  };
  const token = jwt.sign(payload, process.env.jwtPrivateKey, {
    expiresIn: "6h",
  });
  return { user: { ...newUser.toJSON(), company_type: company.company_type }, token };
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

module.exports = { getUser, getAllUsers, createUser, editUser, loginUser };
