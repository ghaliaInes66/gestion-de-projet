const { Router } = require("express");
const router = Router();
const taskController = require("../controller/TaskController");
router.post("/create", taskController.Create_Task);
router.get("/:projectId", taskController.Get_Tasks);
router.put("/update/:taskId", taskController.Update_Task);
router.delete("/delete/:taskId", taskController.delete_Task);
module.exports = router;