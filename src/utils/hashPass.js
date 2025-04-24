const bcrypt = require("bcryptjs");
const saltRounds = 10;

const hashPass = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

// async function printPass(){
//   const result = await hashPass('1234');
//   console.log(result);
// }
// printPass();

module.exports = hashPass;
