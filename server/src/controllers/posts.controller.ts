import { Request, Response } from "express";
import * as queries from "../db/queries.js";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, body } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!title || !body) {
      return res
        .status(400)
        .json({ message: "Required fields are not provided" });
    }

    const newPost = await queries.createPost({
      title,
      body,
      userId,
    });

    if (!newPost) {
      return res.status(400).json({ message: "Error creating post" });
    }

    return res.status(201).json({ post: newPost });
  } catch (error) {
    return res.status(500).json({ message: `Internal Server Error: ${error}` });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id as string;

    const post = await queries.getPostById(postId);

    if (!post) {
      return res
        .status(404)
        .json({ message: `Post with id of ${postId} does not exist` });
    }

    return res.status(200).json({ post });
  } catch (error) {
    return res.status(500).json({ message: `Internal Server Error: ${error}` });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await queries.getAllPosts();

    return res.status(200).json({ posts });
  } catch (error) {
    return res.status(500).json({ message: `Internal Server Error: ${error}` });
  }
};

export const editPost = async (req: Request, res: Response) => {
  try {
    const { title, body } = req.body;
    const postId = req.params.id as string;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!title && !body) {
      return res
        .status(400)
        .json({ message: "At least one field (title or body) is required" });
    }

    const editedPost = await queries.editPost(userId, postId, { title, body });

    if (!editedPost) {
      return res
        .status(404)
        .json({ message: `Post with id of ${postId} does not exist` });
    }

    return res.status(200).json({ post: editedPost });
  } catch (error) {
    return res.status(500).json({ message: `Internal Server Error: ${error}` });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id as string;
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const deletedPost = await queries.deletePost(userId, postId);

    if (!deletedPost) {
      return res
        .status(404)
        .json({ message: `Post with id of ${postId} does not exist` });
    }

    return res
      .status(200)
      .json({ message: `Post with id ${postId} deleted successfully` });
  } catch (error) {
    return res.status(500).json({ message: `Internal Server Error: ${error}` });
  }
};
