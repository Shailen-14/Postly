import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createPost,
  deletePost,
  editPost,
  getAllPosts,
  getPostById,
} from "../controllers/posts.controller.js";

const router = Router();

router.post("/create", protectRoute, createPost);
router.get("/all", protectRoute, getAllPosts);
router.get("/:id", protectRoute, getPostById);
router.patch("/:id", protectRoute, editPost);
router.delete("/:id", protectRoute, deletePost);

export default router;
