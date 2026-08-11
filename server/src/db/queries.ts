import { users, posts, type NewUser, type NewPost } from "./schema.js";
import { db } from "./index.js";
import { and, eq, or } from "drizzle-orm";

export const createUser = async (data: NewUser) => {
  const [user] = await db.insert(users).values(data).returning({
    id: users.id,
    username: users.username,
    email: users.email,
    createdAt: users.createdAt,
  });
  return user;
};

export const getUserByUsername = async (username: string) => {
  return db.query.users.findFirst({
    where: eq(users.username, username),
  });
};

export const getUserByEmailOrUsername = async (
  email: string,
  username: string,
) => {
  return db.query.users.findFirst({
    where: or(eq(users.email, email), eq(users.username, username)),
    columns: { password: false },
  });
};

export const getUserById = async (id: number) => {
  return db.query.users.findFirst({
    where: eq(users.id, id),
    columns: { password: false },
  });
};

export const createPost = async (data: NewPost) => {
  const [post] = await db.insert(posts).values(data).returning();
  return post;
};

export const getAllPosts = async () => {
  return db.query.posts.findMany({
    with: { user: { columns: { password: false } } },
  });
};

export const getPostById = async (id: string) => {
  return db.query.posts.findFirst({
    with: { user: { columns: { password: false } } },
    where: eq(posts.id, id),
  });
};

export const editPost = async (
  userId: number,
  id: string,
  data: Partial<NewPost>,
) => {
  const [post] = await db
    .update(posts)
    .set(data)
    .where(and(eq(posts.id, id), eq(posts.userId, userId)))
    .returning();
  return post;
};

export const deletePost = async (userId: number, id: string) => {
  const [post] = await db
    .delete(posts)
    .where(and(eq(posts.id, id), eq(posts.userId, userId)))
    .returning();
  return post;
};
