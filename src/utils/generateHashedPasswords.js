const bcrypt = require('bcryptjs');

module.exports = async (password)=>( await bcrypt.hash(password, await bcrypt.genSalt(10)) );