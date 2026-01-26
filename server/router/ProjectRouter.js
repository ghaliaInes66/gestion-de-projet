const { Router } = require("express");
const router = Router();
const projectController = require("../controller/ProjectController");

// Standard RESTful routes
router.post("/", projectController.Create_Project);
router.get("/", projectController.Get_All_Projects);
router.get("/user/:userId", projectController.Get_Projects);
router.get("/:projectId", projectController.Get_Project);
router.put("/:projectId", projectController.Update_Project);
router.delete("/:projectId", projectController.delete_Project);

// Legacy routes for compatibility
router.post("/create", projectController.Create_Project);
router.put("/update/:projectId", projectController.Update_Project);
router.delete("/delete/:projectId", projectController.delete_Project);

module.exports = router;
