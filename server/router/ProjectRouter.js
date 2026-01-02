const { Router } = require("express");
const router = Router();
const projectController = require("../controller/ProjectController");
router.post("/create", projectController.Create_Project);
router.get("/:userId", projectController.Get_Projects);
router.put("/update/:projectId", projectController.Update_Project);
router.delete("/delete/:projectId", projectController.delete_Project);
module.exports = router;
