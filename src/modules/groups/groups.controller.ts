import { NextFunction, Request, Response } from "express";
import CreateGroupDto from "./dtos/create_group.dto";

import GroupService from "./groups.service";

export default class GroupController {
  private groupService = new GroupService();

  public createGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: CreateGroupDto = req.body;
      const userId = req.user.id;
      const result = await this.groupService.createGroup(userId, model);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getAllGroups = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const posts = await this.groupService.getAllGroup();
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  };
}
