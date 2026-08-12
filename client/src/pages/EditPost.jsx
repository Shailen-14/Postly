import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { api } from "../api/axios";

const EditPost = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await api.get("/api/auth/me");
        return res.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    retry: false,
  });

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      try {
        const res = await api.get(`/api/posts/${id}`);
        return res.data.post || res.data;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    enabled: !!id,
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        body: post.body,
      });
    }
  }, [post, reset]);

  const handleUpdatedData = async (values) => {
    try {
      const currentUserId = authUser?.id || authUser?.user?.id;

      if (!currentUserId) {
        toast.error("You must be logged in to edit a post!");
        return;
      }

      const valuesWithUserId = { ...values, userId: currentUserId };

      await api.patch(`/api/posts/${id}`, valuesWithUserId);

      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["post", id] });

      toast.success("Post edited successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    }
  };

  const handleDeletePost = async () => {
    try {
      await api.delete(`/api/posts/${id}`);

      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      await queryClient.invalidateQueries({ queryKey: ["post", id] });

      toast.success("Post deleted successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete post.";
      toast.error(message);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-10 text-slate-500">
        Loading post data...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-[calc(100vh-80px)]">
      <form
        onSubmit={handleSubmit(handleUpdatedData)}
        className="flex flex-col gap-5 items-center border-[0.2px] border-black/30 rounded w-130 px-6 py-5 shadow-sm"
      >
        <h2 className="text-xl font-semibold">Edit Post</h2>

        <div className="flex flex-col w-100 gap-1">
          <input
            type="text"
            placeholder="Enter title..."
            {...register("title", {
              required: "Title is required",
            })}
            className="w-full px-4 py-2 text-sm border-[0.5px] border-slate-400 rounded text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 transition-colors"
          />
          {errors.title && (
            <span className="text-red-600 text-[12px] translate-x-1">
              {errors.title.message}
            </span>
          )}
        </div>

        <div className="flex flex-col w-100 gap-1">
          <textarea
            rows={4}
            placeholder="Enter body..."
            maxLength={400}
            className="w-full px-4 py-2 text-sm border-[0.5px] border-slate-400 rounded text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 transition-colors resize-none"
            {...register("body", {
              required: "Body is required",
            })}
          ></textarea>
          {errors.body && (
            <span className="text-red-600 text-[12px] translate-x-1">
              {errors.body.message}
            </span>
          )}
        </div>

        <div className="flex w-100 gap-3 justify-between items-center mt-2">
          <button
            type="button"
            onClick={handleDeletePost}
            className="cursor-pointer bg-red-600 text-white rounded px-4 py-1.5 text-sm font-medium transition-opacity hover:bg-red-700 active:opacity-80"
          >
            Delete Post
          </button>

          <button
            type="submit"
            className="cursor-pointer bg-black text-white rounded px-6 py-1.5 text-sm font-medium transition-opacity active:opacity-80"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
