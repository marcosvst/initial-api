const User = require("../models/User.model");

exports.get = async (user) => {
  const { id, name, email } = await User.query().findById(user.data.userId);

  return {
    id,
    name,
    email,
  };
};

exports.getAllUsers = async () => {
  const userList = await User.query();

  return userList;
};

exports.getUserByEmail = async (email) => {
  const user = await User.query().findOne({
    email,
  });

  return user;
};

exports.insertUser = async (name, email, password, status, trx) => {
  const user = await User.query(trx).insert({
    name,
    email,
    password,
    status,
  });

  return user;
};

exports.checkCredentials = async (email, password) => {
  const user = await User.query().findOne({
    email,
    senha,
  });

  return user;
};

exports.getByEmailAndUpdate = async (email, data) => {
  const user = await User.query()
    .findOne({
      email,
    })
    .patch({
      status: data,
    });

  return user;
};
