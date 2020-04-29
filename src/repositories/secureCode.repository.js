const SecureCode = require("../models/SecureCode.model");

exports.insertSecureCode = async (secureCode, userId, expireDate, trx) => {
  const secureCodeRegister = await SecureCode.query(trx).insert({
    secure_code: secureCode,
    belongs_to: userId,
    expires_at: expireDate,
  });

  return secureCodeRegister;
};

exports.getByOwner = async (userId) => {
  const code = await SecureCode.query().findOne({
    belongs_to: userId,
  });

  return code;
};
