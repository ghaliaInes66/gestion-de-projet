const { Router } = require("express");
const router = Router();
const userController = require("../controller/UserController");
router.post("/signup", userController.signup_Post);

router.post("/login", userController.login_Post);
module.exports = router;
