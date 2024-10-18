import { Router } from "express";
import TodoRoute from "./todo.routes";

const router = Router();

router.use("/todo", TodoRoute);

export default router;
