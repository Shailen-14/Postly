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
router.get("/all", getAllPosts);
router.get("/:id", getPostById);
router.patch("/:id", protectRoute, editPost);
router.delete("/:id", protectRoute, deletePost);

export default router;
