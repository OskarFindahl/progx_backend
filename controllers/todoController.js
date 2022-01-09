const todoModel = require("../models/todoModel");
const loadedUser = require("../controllers/authController");

exports.postTodo = async (req, res, next) => {
  const { title, description, status } = req.body;
  try {
    const todo = new todoModel({
      title: title,
      description: description,
      status: status,
    });
    const result = await todo.save();
    res.status(200).json({
      message: "Todo created",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.editTodo = async (req, res, next) => {
  const { title, description, status, _id } = req.body;

  try {
    const result = await todoModel.updateOne(
      { _id: _id },
      { title: title, description: description, status: status }
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

exports.getAllTodos = async (req, res, next) => {
  try {
    const result = await todoModel.find();
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

exports.deleteTodo = async (req, res, next) => {
  const { id } = req.body;
  try {
    const result = await todoModel.findOneAndDelete({ _id: id });
    res.status(200).json({
      message: "Todo deleted",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
