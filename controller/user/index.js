var express = require("express");
var router = express.Router();
var controller = require('./controller')


// /* GET home page. */
router.get("/", controller.user);
// router.get("/product",controller.product)


module.exports = router;
