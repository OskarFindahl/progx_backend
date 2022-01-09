const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoController");
const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");

router.post("/create",  todoController.postTodo);
router.get("/all", todoController.getAllTodos);
router.delete("/delete", todoController.deleteTodo);
router.put("/edit", todoController.editTodo);

module.exports = router;
