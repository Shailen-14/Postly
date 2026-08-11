import express, { urlencoded } from "express";
import cors from "cors";
import env from "./config/env.config.js";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import postsRoutes from "./routes/posts.route.js";

const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postsRoutes);

const PORT = env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

