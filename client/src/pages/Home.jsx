import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PostCard from "../components/PostCard";

const Home = () => {
  const navigate = useNavigate();

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/auth/me");
        return res.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    retry: false,
  });

  const {
    data: posts,
    isLoading,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/posts/all");
        return res.data.posts;
      } catch (error) {
        console.log(error);
        toast.error("Error fetching posts!");
        return [];
      }
    },
  });

  if (isLoading) {
    return (
      <div className="text-center mt-10 text-slate-500">Loading posts...</div>
    );
  }

  const currentUserId = authUser?.user?.id;
  console.log("Full authUser object:", authUser);
  return (
    <div className="m-auto max-w-md w-full flex flex-col gap-4 p-4">
      {posts?.map((post) => {
        const postId = post.id;
        const postOwnerId = post.userId;
        const isOwner = Boolean(currentUserId && currentUserId === postOwnerId);

        console.log("Comparing IDs:", {
          currentUserId: authUser?.id,
          currentUserIdType: typeof authUser?.id,
          postUserId: post.userId,
          postUserIdType: typeof post.userId,
        });

        return (
          <PostCard
            key={postId}
            title={post.title}
            body={post.body}
            username={isOwner ? "You" : post.user?.username}
            onClick={() =>
              navigate(isOwner ? `/post/${postId}/edit` : `/post/${postId}`)
            }
          />
        );
      })}
    </div>
  );
};

export default Home;
