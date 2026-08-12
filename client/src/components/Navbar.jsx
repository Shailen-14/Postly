import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  const logoutUser = async () => {
    try {
      await axios.post("http://localhost:5001/api/auth/logout");

      queryClient.setQueryData(["authUser"], null);

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="bg-black text-white flex justify-between items-center px-6 py-3 mb-10">
      <h1>
        <Link to={"/"} className="font-semibold text-xl">
          Postly
        </Link>
      </h1>
      <div>
        {authUser ? (
          <div className="flex justify-between gap-5 items-center">
            <h2 className="font-medium text-[18px]">
              {authUser.user?.username}
            </h2>
            <button
              onClick={() => navigate("/create")}
              className="cursor-pointer bg-white text-black rounded px-3 py-0.5 font-medium"
            >
              Create Post
            </button>
            <button
              onClick={() => logoutUser()}
              className="cursor-pointer bg-white text-black rounded px-3 py-0.5 font-medium"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex justify-between gap-5 items-center">
            <button onClick={() => navigate("/login")} className="cursor-pointer bg-white text-black rounded px-3 py-0.5 font-medium">Login</button>
            <button onClick={() => navigate("/register")} className="cursor-pointer bg-white text-black rounded px-3 py-0.5 font-medium">Register</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
