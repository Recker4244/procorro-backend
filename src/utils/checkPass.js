
//const hashPass = require("../utils/hashPass");
const bcrypt = require('bcryptjs');

const checkAuth = async (plaintext, hashedpass) => {
  const result = await bcrypt.compare(plaintext, hashedpass);
  // const hashed = await hashPass(plaintext);
  console.log(result);

  return result;
};

module.exports = checkAuth;