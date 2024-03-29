import { BaseHttpResponse } from '../lib/base-http-response';
import { Request, Response } from 'express';
import { controller, httpDelete, httpGet, httpPost, httpPut } from 'inversify-express-utils';
import { QueryOptions } from 'mongoose';
import { TodoService } from './../../logic/services/todo.service';

@controller('/api/v1/todo')
export class TodoController {
  constructor(private readonly _service: TodoService) {}

  @httpGet('/health-check')
  /**
   * @openapi
   * /api/v1/health-check:
   *  get:
   *     tags:
   *     - Healthcheck
   *     description: Responds if the app is up and running
   *     responses:
   *       200:
   *         description: App is up and running
   */
  async index(req: Request, res: Response) {
    const response = BaseHttpResponse.healthy(
      { message: 'Server is healthy 🥳' },
      200
    );
    res.json(response);
  }

  @httpPost('/')
  async create(req: Request, res: Response) {
    try {
      const todo = await this._service.create(req.body);
      const response = BaseHttpResponse.success(
        todo,
        201
      );
      res.json(response);
    } catch (error) {
      const response = BaseHttpResponse.failed("Can't add this task", 500);
      res.json(response);
    }
  }

  @httpGet('/')
  async all(req: Request, res: Response) {
    try {
      const { filter, sortBy, limit, page } = req.query;
      const todos = await this._service.all({ filter, sortBy, limit, page });
      const response = BaseHttpResponse.success(
        todos,
        200
      );
      res.json(response);
    } catch (error) {
      const response = BaseHttpResponse.failed("Can't get this task", 500);
      res.json(response);
    }
  }

  @httpGet('/:id')
  async find(req: Request, res: Response) {
    try {
      const todoId = req.params.id;
      const todo = await this._service.find(todoId);
      const response = BaseHttpResponse.success(
        todo,
        200
      );
      res.json(response);
    } catch (error) {
      const response = BaseHttpResponse.failed("Can't get this task", 500);
      res.json(response);
    }
  }

  @httpPut('/:id')
  async update(req: Request, res: Response) {
    try {
      const todoId = req.params.id;
      const todo = await this._service.update(req.body, todoId);
      const response = BaseHttpResponse.success(
        todo,
        200
      );
      res.json(response);
    } catch (error) {
      const response = BaseHttpResponse.failed("Can't update this task", 500);
      res.json(response);
    }
  }

  @httpDelete('/:id')
  async delete(req: Request, res: Response) {
    try {
      const todoId = req.params.id;
      const todo = await this._service.delete(todoId);
      const response = BaseHttpResponse.success(
        todo,
        200
      );
      res.json(response);
    } catch (error) {
      const response = BaseHttpResponse.failed("This task doesn't exist", 500);
      res.json(response);
    }
  }

  @httpDelete('/')
  async clear(req: Request, res: Response) {
    try {
      const todos = await this._service.clear();
      const response = BaseHttpResponse.success(
        todos,
        200
      );
      res.json(response);
    } catch (error) {
      const response = BaseHttpResponse.failed("Failed when trying to clear all tasks", 500);
      res.json(response);
    }
  }
}
