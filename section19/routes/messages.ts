import express from "express";
import MessagesController from "../controllers/messages";

const router = express.Router();

router.get("/messages/edit-success", MessagesController.editSuccess);

router.get("/messages/delete-success", MessagesController.deleteSuccess);

export default router;
