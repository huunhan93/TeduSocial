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

  public getAllMembers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const groupId = req.params.id;
      const members = await this.groupService.getAllMembers(groupId);
      res.status(200).json(members);
    } catch (error) {
      next(error);
    }
  };

  public updateGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: CreateGroupDto = req.body;
      const groupId = req.params.id;
      const result = await this.groupService.updateGroup(groupId, model);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public deleteGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const groupId = req.params.id;
      const result = await this.groupService.deleteGroup(groupId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public joinGroup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user.id;
      const groupId = req.params.id;
      const result = await this.groupService.joinGroup(userId, groupId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public approveJoinRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.user_id;
      const groupId = req.params.group_id;
      const result = await this.groupService.approveJoinRequest(userId, groupId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public addManager = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const request = req.body;
      const groupId = req.params.group_id;
      const result = await this.groupService.addManager(groupId, request);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public removeManager = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.user_id;
      const groupId = req.params.group_id;
      const result = await this.groupService.removeManager(groupId, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public removeMember = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.user_id;
      const groupId = req.params.group_id;
      const result = await this.groupService.removeMember(groupId, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
