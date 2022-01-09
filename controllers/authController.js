const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.postSignin = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  try {
    const exsitUser = await userModel.findOne({ email: email });
    if (exsitUser) {
      const error = new Error(
        "Email already exist, please pick another email!"
      );
      res.status(409).json({
        error: "Email already exist, please pick another email! ",
      });
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new userModel({
      fullname: fullname,
      email: email,
      password: hashedPassword,
      admin: false,
    });
    const result = await user.save();
    res.status(200).json({
      message: "User created",
      user: { id: result._id, email: result.email },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

let loadedUser;
exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email: email });

    if (!user) {
      const error = new Error("user with this email not found!");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;

    const comparePassword = bcrypt.compare(password, user.password);

    if (!comparePassword) {
      const error = new Error("password is not match!");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      { email: loadedUser.email, admin: loadedUser.admin },
      "expressnuxtsecret",
      {
        expiresIn: "20m", // it will expire token after 20 minutes and if the user then refresh the page will log out
      }
    );
    res.status(200).json({ token: token });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUser = (req, res, next) => {
  // this function will send user data to the front-end as I said above authFetch on the user object in nuxt.config.js will send a request and it will execute
  res.status(200).json({
    user: {
      id: loadedUser._id,
      fullname: loadedUser.fullname,
      email: loadedUser.email,
      admin: loadedUser.admin,
    },
  });
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const result = await userModel.find();
    res.status(200).json({
      result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editUser = async (req, res, next) => {
  const { fullname, email, _id, admin } = req.body;

  try {
    const result = await userModel.updateOne(
      { _id: _id },
      { fullname: fullname, email: email, admin: admin }
    );
    res.status(200).json({
      result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  const { id } = req.body;
  try {
    const result = await userModel.findOneAndDelete({ _id: id });
    res.status(200).json({
      message: "User deleted",
      result,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
