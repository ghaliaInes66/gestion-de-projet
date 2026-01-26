const { Router } = require("express");
const router = Router();
const userController = require("../controller/UserController");

// Auth routes - must be before :userId routes
router.post("/signup", userController.signup_Post);
router.post("/login", userController.login_Post);

// Standard RESTful routes
router.post("/", userController.signup_Post);
router.get("/", userController.Get_Users);
router.get("/:userId", userController.Get_User);
router.put("/:userId", userController.Update_User);
router.delete("/:userId", userController.Delete_User);

module.exports = router;
