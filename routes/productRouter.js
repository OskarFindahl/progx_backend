const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const isAuth = require("../middleware/isAuth");
const isAdmin = require("../middleware/isAdmin");

router.post("/create", isAdmin, productController.postProduct);
router.get("/all", productController.getAllProducts);
router.delete("/delete", isAdmin, productController.deleteProduct);

module.exports = router;
