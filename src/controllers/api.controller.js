const constants = require("../utils/constants");

exports.get = async (req, res, next) => {
  try {
    res.status(200).send({
      name: "Base API",
      version: "1.0.0",
    });
  } catch (e) {
    res.status(200).send(constants.MESSAGES.FAIL_MESSAGES.REQUEST_FAIL);
  }
};
