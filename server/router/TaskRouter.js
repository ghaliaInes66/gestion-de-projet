const { Router } = require("express");
const router = Router();
const taskController = require("../controller/TaskController");

// Standard RESTful routes
router.post("/", taskController.Create_Task);
router.get("/", taskController.Get_All_Tasks);
router.get("/project/:projectId", taskController.Get_Tasks);
router.get("/:taskId", taskController.Get_Task);
router.put("/:taskId", taskController.Update_Task);
router.delete("/:taskId", taskController.delete_Task);

// Legacy routes for compatibility
router.post("/create", taskController.Create_Task);
router.put("/update/:taskId", taskController.Update_Task);
router.delete("/delete/:taskId", taskController.delete_Task);

module.exports = router;