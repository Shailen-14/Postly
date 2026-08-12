import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import EditPost from "./pages/EditPost";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer, Slide } from "react-toastify";
import Navbar from "./components/Navbar";
import CreatePost from "./pages/CreatePost";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar />
        <ToastContainer
          position="top-center"
          autoClose={2500}
          hideProgressBar={true}
          draggable={false}
          theme="light"
          transition={Slide}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/post/:id/edit" element={<EditPost />} />
          <Route path="/create" element={<CreatePost />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
