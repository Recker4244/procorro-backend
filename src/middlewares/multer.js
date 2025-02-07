const multer = require('multer');
const upload = multer({
  // limits: {
  //   fileSize: 1000000,
  // },
});

module.exports = upload;