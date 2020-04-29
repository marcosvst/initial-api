const bcrypt = require("bcrypt");

exports.encrypt = async (password, rounds) => {
  const salt = await bcrypt.genSalt(rounds);
  const hash = await bcrypt.hashSync(password, salt);

  return hash;
};

exports.compare = async (password, hash) => {
  const check = await bcrypt.compareSync(password, hash);

  return check;
};

exports.generateSecureCode = () => {
  return Math.random().toString(36).substr(2, 5);
};
