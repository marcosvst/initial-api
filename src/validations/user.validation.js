const { check } = require("express-validator");

exports.store = [
  check("email").isEmail().withMessage("E-mail must be valid"),
  check("password")
    .isLength({ min: 6, max: 12 })
    .withMessage("Password must be between 6-12 characters"),
];

exports.login = [
  check("email").isEmail().withMessage("E-mail must be valid"),
  check("password")
    .isLength({ min: 6, max: 12 })
    .withMessage("Password must be between 6-12 characters"),
];
