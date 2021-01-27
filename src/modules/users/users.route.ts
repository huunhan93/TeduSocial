import { Route } from "@core/interfaces";
import { validationMiddleware } from "@core/middleware";
import { Router } from "express";
import RegisterDto from "./dtos/register.dto";
import UsersController from "./users.controller";

export default class UsersRoute implements Route {
  public path = "/api/users";
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, this.usersController.register);
    // POST: http://localhost:5000/api/users
    this.router.put(
      this.path + "/:id",
      validationMiddleware(RegisterDto, true),
      this.usersController.updateUser
    ); // PUT: http://localhost:5000/api/users/:id
    this.router.get(this.path + "/:id", this.usersController.getUserById);
    // GET: http://localhost:5000/api/users/:id
  }
}
