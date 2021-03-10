import { Route } from "@core/interfaces";
import { authMiddleware, validationMiddleware } from "@core/middleware";
import { Router } from "express";
import ConversationController from "./conversations.controller";
import SendMessageDto from "./dtos/send_message.dto";

export default class ConversationRoute implements Route {
  public path = "/api/v1/conversations";
  public router = Router();
  public conversationController = new ConversationController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      this.path + "/sendMessage",
      authMiddleware,
      validationMiddleware(SendMessageDto, true),
      this.conversationController.sendMessage
    );
    this.router.get(
      this.path,
      authMiddleware,
      this.conversationController.getMyConversation
    );
  }
}
