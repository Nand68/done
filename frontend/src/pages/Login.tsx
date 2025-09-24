/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [username, serUsername] = useState("");
  const [password, serPassword] = useState("");
  const navigate = useNavigate();
  const loginHandler = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log("here");
      if (res.data.ok) {
        toast.success("Welcome Back");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div>
      <h1 className="text-white hover:text-black">Username : emilys</h1>
      <h1 className="text-white hover:text-black">Password : emilyspass</h1>
      <form className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <h1 className="font-sans text-4xl p-2 ">Login Form</h1>
        <div className="border-2 p-2 m-2  rounded-3xl">
          <div className="p-4">
            <label htmlFor="username">Username : </label>
            <input
              className="border-2 m-2 rounded-2xl p-2 focus:bg-amber-200"
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => {
                serUsername(e.currentTarget.value);
              }}
            />
          </div>
          <div className="p-4">
            <label htmlFor="password">Password : </label>
            <input
              className="border-2 m-2 rounded-2xl p-2 focus:bg-amber-200"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => {
                serPassword(e.currentTarget.value);
              }}
            />
          </div>
        </div>
        <div className="justify-end p-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              loginHandler();
            }}
            className="w-87 border-2 p-2 rounded-2xl hover:bg-red-400 cursor-pointer"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
