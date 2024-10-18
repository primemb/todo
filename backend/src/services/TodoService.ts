import HttpException from "../models/HttpException";
import Todo, { ITodo } from "../models/Todo";

export default class TodoService {
  public async create(todo: Partial<ITodo>): Promise<ITodo> {
    try {
      const newTodo = new Todo(todo);
      newTodo.sequence = await this.getLatestSequence();
      return await newTodo.save();
    } catch (error) {
      throw new HttpException(400, "Failed to create todo");
    }
  }

  public async findAll(): Promise<ITodo[]> {
    try {
      return await Todo.find().sort({ sequence: 1 });
    } catch (error) {
      throw new HttpException(500, "Failed to fetch todos");
    }
  }

  public async findById(id: string): Promise<ITodo> {
    try {
      const todo = await Todo.findById(id);
      if (!todo) {
        throw new HttpException(404, "Todo not found");
      }
      return todo;
    } catch (error) {
      throw error;
    }
  }

  public async update(id: string, todoData: Partial<ITodo>): Promise<ITodo> {
    try {
      const todo = await Todo.findByIdAndUpdate(id, todoData, { new: true });
      if (!todo) {
        throw new HttpException(404, "Todo not found");
      }
      return todo;
    } catch (error) {
      throw error;
    }
  }

  public async delete(id: string): Promise<void> {
    try {
      const result = await Todo.findByIdAndDelete(id);
      if (!result) {
        throw new HttpException(404, "Todo not found");
      }
    } catch (error) {
      throw error;
    }
  }

  public async reorder(ids: string[]): Promise<ITodo[]> {
    try {
      const todos = await this.findAll();

      if (todos.length !== ids.length) {
        throw new HttpException(404, "Some todos not found");
      }

      // Create a set of existing ids for quick lookup
      const existingIds = new Set(todos.map((todo) => todo._id.toString()));

      // Ensure all provided ids exist
      for (const id of ids) {
        if (!existingIds.has(id)) {
          throw new HttpException(404, `Todo with id ${id} not found`);
        }
      }

      // Build bulk update operations
      let bulkOps = [];
      for (let i = 0; i < ids.length; i++) {
        const todoIndex = todos.findIndex(
          (todo) => todo._id.toString() === ids[i]
        );

        const todo = todos[todoIndex];

        if (todo.sequence === i) {
          continue;
        }

        bulkOps.push({
          updateOne: {
            filter: { _id: todo._id },
            update: { $set: { sequence: i } },
          },
        });
        todos[todoIndex].sequence = i;
      }

      // Execute bulk operations
      await Todo.bulkWrite(bulkOps);

      return todos;
    } catch (error) {
      throw error;
    }
  }

  private async getLatestSequence(): Promise<number> {
    try {
      const latestTodo = await Todo.findOne().sort({ sequence: -1 });
      return latestTodo ? latestTodo.sequence + 1 : 0;
    } catch (error) {
      throw error;
    }
  }
}
