import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";

const CreatePost = () => {
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
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const handleCreatePost = async (values) => {
    try {
      const currentUserId = authUser?.user?.id || authUser?.id;

      if (!currentUserId) {
        toast.error("You must be logged in to create a post!");
        return;
      }
      const valuesWithUserId = { ...values, userId: currentUserId };

      await api.post("/api/posts/create", valuesWithUserId);
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created successfully!");
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

  return (
    <div className="flex justify-center items-center h-150">
      <form
        onSubmit={handleSubmit(handleCreatePost)}
        className="flex flex-col gap-5 items-center border-[0.2px] border-black/30 rounded w-130 px-6 py-5"
      >
        <h2>Create Post</h2>
        <div className="flex flex-col w-100 gap-1">
          <input
            type="text"
            placeholder="Enter title..."
            {...register("title", {
              required: "Title is required",
            })}
            className="w-full px-4 py-2 text-sm border-[0.5px] border-slate-400 rounded text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:ring-0 transition-colors"
          />
          <span className="text-red-600 text-[12px] translate-x-3.5">
            {errors.title && errors.title.message}
          </span>
        </div>

        <div className="flex flex-col w-100 gap-1">
          <textarea
            placeholder="Enter body..."
            maxLength={400}
            className="w-full px-4 py-2 text-sm border-[0.5px] border-slate-400 rounded text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:ring-0 transition-colors"
            {...register("body", {
              required: "Body is required",
            })}
          ></textarea>
          <span className="text-red-600 text-[12px] translate-x-3.5">
            {errors.body && errors.body.message}
          </span>
        </div>
        <button
          type="submit"
          className="cursor-pointer bg-black text-white rounded px-6 py-1.5 flex font-medium transition-opacity active:opacity-80"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
