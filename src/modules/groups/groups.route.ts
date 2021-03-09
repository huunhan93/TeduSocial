import { Route } from "@core/interfaces";
import { authMiddleware, validationMiddleware } from "@core/middleware";
import { Router } from "express";
import CreateGroupDto from "./dtos/create_group.dto";
import SetManagerDto from "./dtos/set_manager.dto";
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
    this.router.put(
      this.path + "/:id",
      authMiddleware,
      validationMiddleware(CreateGroupDto, true),
      this.groupController.updateGroup
    );
    this.router.get(this.path, this.groupController.getAllGroups);
    this.router.delete(this.path + "/:id", this.groupController.deleteGroup);

    //Members
    this.router.post(
      this.path + "/members/:id",
      authMiddleware,
      this.groupController.joinGroup
    );
    this.router.put(
      this.path + "/members/:user_id/:group_id",
      authMiddleware,
      this.groupController.approveJoinRequest
    );
    this.router.delete(
      this.path + "/members/:user_id/:group_id",
      authMiddleware,
      this.groupController.removeMember
    );
    this.router.get(
      this.path + "/members/:id",
      this.groupController.getAllMembers
    );

    //Manager
    this.router.post(
      this.path + "/managers/:id",
      authMiddleware,
      validationMiddleware(SetManagerDto, true),
      this.groupController.addManager
    );
    this.router.delete(
      this.path + "/managers/:group_id/:user_id",
      authMiddleware,
      this.groupController.removeManager
    );
  }
}
