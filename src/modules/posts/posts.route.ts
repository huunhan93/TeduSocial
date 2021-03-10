import { Route } from "@core/interfaces";
import { authMiddleware, validationMiddleware } from "@core/middleware";
import { Router } from "express";
import CreateCommentDto from "./dtos/create_comment.dto";
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

    this.router.get(this.path, this.postsController.getAllPosts);
    this.router.get(this.path + "/:id", this.postsController.getPostById);
    this.router.get(
      this.path + "/paging/:page",
      this.postsController.getAllPaging
    );
    this.router.delete(
      this.path + "/:id",
      authMiddleware,
      this.postsController.deletePost
    );

    this.router.put(
      this.path + "/like/:id",
      authMiddleware,
      this.postsController.likePost
    );
    this.router.put(
      this.path + "/unlike/:id",
      authMiddleware,
      this.postsController.unlikePost
    );

    this.router.post(
      this.path + "/comments/:id",
      authMiddleware,
      validationMiddleware(CreateCommentDto, true),
      this.postsController.addComment
    );
    this.router.delete(
      this.path + "/comments/:id/:comment_id",
      authMiddleware,
      this.postsController.removeComment
    );

    this.router.put(
      this.path + "/share/:id",
      authMiddleware,
      this.postsController.sharePost
    );
    this.router.delete(
      this.path + "/unshare/:id",
      authMiddleware,
      this.postsController.unsharePost
    );
  }
}
