import { Router } from "express";
import TodoController from "../controllers/TodoController";
import { body, param } from "express-validator";
import validateRequest from "../common/validateRequest";

const router = Router();
const controller = new TodoController();

router.post(
  "/",
  [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .isLength({ max: 100 })
      .withMessage("Title cannot exceed 100 characters"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    body("completed")
      .optional()
      .isBoolean()
      .withMessage("Completed must be a boolean"),
  ],
  validateRequest,
  controller.create
);

router.get("/", controller.findAll);

router.put(
  "/reorder",
  [
    body("ids")
      .isArray({ min: 2 })
      .withMessage("Reorder requires at least two IDs"),
    body("ids.*").isMongoId().withMessage("Invalid Todo ID format"),
  ],
  validateRequest,
  controller.reorder
);

router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid Todo ID format")],
  validateRequest,
  controller.findById
);

router.put(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid Todo ID format"),
    body("title")
      .optional()
      .isString()
      .withMessage("Title must be a string")
      .isLength({ max: 100 })
      .withMessage("Title cannot exceed 100 characters"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    body("completed")
      .optional()
      .isBoolean()
      .withMessage("Completed must be a boolean"),
  ],
  validateRequest,
  controller.update
);

router.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid Todo ID format")],
  validateRequest,
  controller.delete
);

export default router;
