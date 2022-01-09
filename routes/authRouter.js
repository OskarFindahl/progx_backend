const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");

router.post("/signin", authController.postSignin);
router.post("/login", authController.postLogin);
router.get("/user", isAuth, authController.getUser);
router.get("/users/all", isAdmin, authController.getAllUsers);
router.put("/user/edit", isAdmin, authController.editUser);
router.delete("/user/delete", isAdmin, authController.deleteUser);

module.exports = router;
