import { Route } from "@core/interfaces";
import { authMiddleware, validationMiddleware } from "@core/middleware";
import { Router } from "express";
import CreatePostDto from "./dtos/create_post.dto";
import PostsController from "./posts.controller";

export default class PostsRoute implements Route {
  public path = "/api/v1/posts";
  public router = Router();
  public postsController = new PostsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      this.path,
      authMiddleware,
      validationMiddleware(CreatePostDto, true),
      this.postsController.createPost
    );

    this.router.put(
      this.path + "/:id",
      authMiddleware,
      validationMiddleware(CreatePostDto, true),
      this.postsController.updatePost
    );

    
  }
}
