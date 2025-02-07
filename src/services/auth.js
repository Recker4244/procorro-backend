const bcrypt = require('bcryptjs');
const credentials = require('../models').credentials;
const User = require('../models').users;
const jwt = require('jsonwebtoken');

const userByUsername = async (username) => {
  return (await User.findOne({
    where: {
      username: username
    }
  })).dataValues;
};


const authenticateUser = async function (reqBody) {
  console.log(reqBody);
  const { username, password } = reqBody;
  const user = await credentials.findOne({
    where: {
      username: username
    }
  });

  if (user === null)
    return 'Invalid id or password.';

  const validPassword = await bcrypt.compare(password, user.dataValues.password);

  if (!validPassword)
    return 'Invalid id or password.';

  const { role, name, github } = await userByUsername(username);

  return {
    accessToken: jwt.sign({ username: username, role: role, name: name, github:github }, process.env.jwtPrivateKey, { expiresIn: '1h' }),
    refreshToken: jwt.sign({ username: username, role: role, name: name, github:github }, process.env.jwtPrivateKey, { expiresIn: '1d' }),
  };
};

const refreshAccessToken = async function (refreshToken) {
  try {
    const decoded = jwt.verify(refreshToken, process.env.jwtPrivateKey);
    const { username, role, name } = decoded;
    return jwt.sign({ username: username, role: role, name: name }, process.env.jwtPrivateKey, { expiresIn: '1d' });
  }
  catch (ex) {
    return 'Invalid refresh token.';
  }
};

module.exports = { refreshAccessToken, authenticateUser };
