import { Route } from "@core/interfaces";
import { authMiddleware, validationMiddleware } from "@core/middleware";
import { Router } from "express";
import CreateGroupDto from "./dtos/create_group.dto";
import GroupController from "./groups.controller";

export default class GroupRoute implements Route {
  public path = "/api/v1/groups";
  public router = Router();
  public groupController = new GroupController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      this.path,
      authMiddleware,
      validationMiddleware(CreateGroupDto, true),
      this.groupController.createGroup
    );

    this.router.get(this.path, this.groupController.getAllGroups);
    this.router.put(
      this.path + "/:id",
      authMiddleware,
      validationMiddleware(CreateGroupDto, true),
      this.groupController.updateGroup
    );
    this.router.delete(this.path + "/:id", this.groupController.deleteGroup);
  }
}
