import { TokenData } from "@modules/auth";
import { NextFunction, Request, Response } from "express";
import CreateCommentDto from "./dtos/create_comment.dto";
import CreatePostDto from "./dtos/create_post.dto";
import { IPost } from "./posts.interface";
import PostService from "./posts.service";

export default class PostsController {
  private postService = new PostService();

  public createPost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: CreatePostDto = req.body;
      const userId = req.user.id;
      const result = await this.postService.createPost(userId, model);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  public updatePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const model: CreatePostDto = req.body;
      const postId = req.params.id;
      const result = await this.postService.updatePost(postId, model);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public getAllPosts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const posts: IPost[] = await this.postService.getAllPosts();
      res.status(201).json(posts);
    } catch (error) {
      next(error);
    }
  };

  public getPostById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const postId = req.params.id;
      const post: IPost = await this.postService.getPostById(postId);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  };

  public getAllPaging = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const page = Number(req.params.page);
      const keyword = req.query.keyword || "";

      const paginationResult = await this.postService.getAllPaging(
        keyword.toString(),
        page
      );
      res.status(201).json(paginationResult);
    } catch (error) {
      next(error);
    }
  };

  public deletePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try{
      const postId = req.params.id;
      const post = await this.postService.deletePost(req.user.id, postId);
      res.status(200).json(post);
    }
    catch(error){
      next(error)
    }
  };

  public likePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try{
      const postId = req.params.id;
      const likes = await this.postService.likePost(req.user.id, postId);
      res.status(200).json(likes);
    }
    catch(error){
      next(error)
    }
  };

  public unlikePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try{
      const postId = req.params.id;
      const likes = await this.postService.unlikePost(req.user.id, postId);
      res.status(200).json(likes);
    }
    catch(error){
      next(error)
    }
  };

  public addComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try{
      const postId = req.params.id;
      const result = await this.postService.addComment({
        text: req.body.text,
        userId: req.user.id,
        postId: postId
      })
      
      res.status(201).json(result);
    }
    catch(error){
      next(error)
    }
  };

  public removeComment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try{
      const postId = req.params.id;
      const likes = await this.postService.removeComment(
        req.params.comment_id,
        postId,
        req.user.id
      )
      
      res.status(200).json(likes);
    }
    catch(error){
      next(error)
    }
  };

  public sharePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try{
      const postId = req.params.id;
      const share = await this.postService.sharePost(req.user.id, postId);
      res.status(200).json(share);
    }
    catch(error){
      next(error)
    }
  };

  public unsharePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try{
      const postId = req.params.id;
      const share = await this.postService.unsharePost(req.user.id, postId);
      res.status(200).json(share);
    }
    catch(error){
      next(error)
    }
  };
}
