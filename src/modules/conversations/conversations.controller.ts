import { NextFunction, Request, Response } from "express";
import ConversationService from "./conversations.service";
import SendMessageDto from "./dtos/send_message.dto";

export default class ConversationController{
    private conversationService = new ConversationService();

  public sendMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: SendMessageDto = req.body;
      const userId = req.user.id;
      const result = await this.conversationService.sendMessage(userId, model);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };
}