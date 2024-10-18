import { NextFunction, Request, Response } from "express";
import TodoService from "../services/TodoService";

export default class TodoController {
  private service: TodoService;

  constructor() {
    this.service = new TodoService();
  }

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const todo = await this.service.create(req.body);
      res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  };

  public findAll = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const todos = await this.service.findAll();
      res.status(200).json(todos);
    } catch (error) {
      next(error);
    }
  };

  public findById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const todo = await this.service.findById(req.params.id);
      res.status(200).json(todo);
    } catch (error) {
      next(error);
    }
  };

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const todo = await this.service.update(req.params.id, req.body);
      res.status(200).json(todo);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.service.delete(req.params.id);
      res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
      next(error);
    }
  };

  public reorder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const todos = await this.service.reorder(req.body.ids);
      res.status(200).json(todos);
    } catch (error) {
      next(error);
    }
  };
}
