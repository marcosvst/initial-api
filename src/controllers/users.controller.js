const User = require("../models/User.model");
const SecureCode = require("../models/SecureCode.model");
const cryptUtils = require("../utils/crypt");
const { validationResult } = require("express-validator");
const moment = require("moment");
const userRepository = require("../repositories/user.repository");
const secureCodeRepository = require("../repositories/secureCode.repository");
const mailerService = require("../services/mailer.service");
const constants = require("../utils/constants");
const authService = require("../services/auth.service");

exports.get = async (req, res, next) => {
  try {
    // Get and decode token
    const user = await authService.decodeToken(req.header("x-access-token"));

    const userData = await userRepository.get(user);

    res.status(200).send(userData);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: constants.MESSAGES.FAIL_MESSAGES.REQUEST_FAIL,
      e,
    });
  }
};

exports.store = async (req, res, next) => {
  try {
    // Check express validator middleware
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const userAlreadyExists = await userRepository.getUserByEmail(email);

    if (userAlreadyExists) {
      return res.status(409).send({
        message: constants.MESSAGES.FAIL_MESSAGES.EMAIL_ALREADY_USED,
        email,
      });
    }

    const encryptedPassword = await cryptUtils.encrypt(password, 10);

    // Transaction to store user and generate secure code
    try {
      const confirmEmail = await User.transaction(async (trx) => {
        const status = constants.USER_STATUS.CREATED;
        const { id: userId } = await userRepository.insertUser(
          name,
          email,
          encryptedPassword,
          status,
          trx
        );

        const secureCode = cryptUtils.generateSecureCode();
        const expireDate = moment().add(3, "days").toISOString();

        const {
          secure_code: secureCodeRegister,
        } = await secureCodeRepository.insertSecureCode(
          secureCode,
          userId,
          expireDate,
          trx
        );

        let confirmEmail = "";
        let templateEmail = `
          <h1 style="color: #333">
            Hello <strong>${name.split(" ")[0]}</strong>,
          </h1>
          <p style="color: #333">
            Your confirmation code is: <strong>${secureCode}<strong>
          </p>
          <br />
          <br />
          <p style="color: #333">
            Thank you for registering!
          </p>
        `;

        if (secureCodeRegister) {
          confirmEmail = await mailerService.send(
            email,
            process.env.EMAIL_SUBJECT,
            templateEmail
          );
        }

        return confirmEmail;
      });

      return res.status(201).send({
        message: constants.MESSAGES.SUCCESS_MESSAGES.USER_RECORDED,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).send({
        message: constants.MESSAGES.FAIL_MESSAGES.TRANSACTION_ERROR,
        err,
      });
    }
  } catch (err) {
    return res.status(500).send({
      message: constants.MESSAGES.FAIL_MESSAGES.ERROR,
      error: err,
    });
  }
};

exports.confirm = async (req, res, next) => {
  try {
    const { code: secureCode, email } = req.body;

    const {
      id: userId,
      status: userStatus,
    } = await userRepository.getUserByEmail(email);

    const {
      secure_code: confirmSecureCode,
      expires_at,
    } = await secureCodeRepository.getByOwner(userId);

    const todaysDate = moment();
    const expireDate = moment(expires_at);

    if (
      secureCode === confirmSecureCode &&
      userStatus === constants.USER_STATUS.CREATED &&
      todaysDate.isBefore(expireDate)
    ) {
      const status = constants.USER_STATUS.CONFIRMED;
      const resp = await userRepository.getByEmailAndUpdate(email, status);

      if (resp) {
        res.status(201).send({
          message: constants.MESSAGES.SUCCESS_MESSAGES.USER_CONFIRMED,
        });
      }
    } else {
      res.status(404).send({
        message: constants.MESSAGES.FAIL_MESSAGES.WRONG_TOKEN_EMAIL,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: constants.MESSAGES.FAIL_MESSAGES.SOMETHING_WRONG,
    });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const {
    id: userId,
    email: storedEmail,
    password: storedPassword,
  } = await userRepository.getUserByEmail(email);

  const loginCheck = await cryptUtils.compare(password, storedPassword);

  if (loginCheck) {
    // Generate JWT
    const jwtToken = await authService.generateToken({
      userId,
      storedEmail,
      storedPassword,
    });

    res.status(201).send({
      token: jwtToken,
      user: {
        id: userId,
        email: storedEmail,
      },
    });
  } else {
    res.status(404).send({
      message: constants.MESSAGES.FAIL_MESSAGES.WRONG_EMAIL_PASSWORD,
    });
  }
};
