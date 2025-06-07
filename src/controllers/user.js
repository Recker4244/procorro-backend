const HttpErrors = require("../../errors/httpErrors");
const userService = require("../services/user");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await userService.loginUser(email, password);
    // eslint-disable-next-line no-unused-vars
    const { password: pwd, ...safeUser } = user.dataValues || user;
    res.status(200).json({ user: safeUser, token });
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userService.getUser(id);
    if (!user) {
      throw new HttpErrors("User not found", 404);
    }
    // eslint-disable-next-line no-unused-vars
    const { password, ...safeUser } = user.dataValues || user;
    res.status(200).json(safeUser);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const getAllUsers = async (req, res) => {
  try {
    const userData = await userService.getAllUsers();
    res.status(200).json(userData);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, designation, company_id } = req.body;
    const { user, token } = await userService.createUser(
      name,
      email,
      password,
      phone,
      designation,
      company_id
    );
    // eslint-disable-next-line no-unused-vars
    const { password: pwd, ...safeUser } = user.dataValues || user;
    res.status(201).json({ user: safeUser, token });
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const editUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, phone, designation, company_id } = req.body;
    const newUser = await userService.editUser(
      id,
      name,
      email,
      phone,
      designation,
      company_id
    );
    res.status(200).json(newUser);
  } catch (err) {
    if (err instanceof HttpErrors) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

module.exports = { getUser, getAllUsers, createUser, editUser, loginUser };
