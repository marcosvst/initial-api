const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const userValidation = require("../validations/user.validation");
const authService = require("../services/auth.service");

router.get("/", authService.authorize, usersController.get);
router.post("/", userValidation.store, usersController.store);
router.post("/confirm", usersController.confirm);
router.post("/login", userValidation.login, usersController.login);

module.exports = router;
