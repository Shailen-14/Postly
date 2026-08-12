import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const handleLoginData = async (values) => {
    try {
      const res = await api.post("/api/auth/login", values);
      console.log(res.data);
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
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
        onSubmit={handleSubmit(handleLoginData)}
        className="flex flex-col gap-5 items-center border-[0.2px] border-black/30 rounded w-130 px-6 py-5"
      >
        <h2>Login</h2>
        <div className="flex flex-col w-100 gap-1">
          <input
            type="text"
            placeholder="Enter username"
            {...register("username", {
              required: "Username is required",
            })}
            className="w-full px-4 py-2 text-sm border-[0.5px] border-slate-400 rounded text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:ring-0 transition-colors"
          />
          <span className="text-red-600 text-[12px] translate-x-3.5">
            {errors.username && errors.username.message}
          </span>
        </div>

        <div className="flex flex-col w-100 gap-1">
          <input
            type="password"
            placeholder="Enter password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password requires minimum of 8 characters",
              },
            })}
            className="w-full px-4 py-2 text-sm border-[0.5px] border-slate-400 rounded text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-800 focus:ring-0 transition-colors"
          />
          <span className="text-red-600 text-[12px] translate-x-3.5">
            {errors.password && errors.password.message}
          </span>
        </div>
        <div className="w-95">
          <Link to={"/register"} className="text-[14px]">
            Don't have an account? <u>Register</u>
          </Link>
        </div>
        <button
          type="submit"
          className="cursor-pointer bg-black text-white rounded px-6 py-1.5 flex font-medium transition-opacity active:opacity-80"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
