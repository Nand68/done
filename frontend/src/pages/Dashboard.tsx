/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { User } from "../common/types";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/auth/userdata", {
          withCredentials: true,
        });
        if (res.data.ok) {
          toast.error("Server hang");
        }
        setUser(res.data.user);
      } catch (err: any) {
        toast.error("Login First");
        navigate("/login");
      }
    };
    loadDashboard();
  }, [navigate]);

  const handleSendMoney = async () => {
    if (!receiverId || !amount) {
      toast.error("Please enter receiverId and amount");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:4000/api/transaction/sendmoney",
        { receiverId, amount: Number(amount) },
        { withCredentials: true }
      );

      if (res.data.ok) {
        toast.success("Money sent successfully");
        setUser((prev) =>
          prev ? { ...prev, amount: prev.amount - Number(amount) } : prev
        );
        setReceiverId("");
        setAmount("");
      } else {
        toast.error(res.data.error || "Failed to send money");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-6 border rounded-lg bg-white shadow-sm">
        {user ? (
          <div>
            <h2 className="text-lg font-semibold mb-1">
              Hello, {user.username}
            </h2>
            <p className="mb-5 text-sm text-gray-600">
              Balance: <span className="font-medium">₹{user.amount}</span>
            </p>

            <h3 className="text-sm font-medium mb-3">Send Money</h3>
            <input
              type="text"
              placeholder="Receiver ID"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <button
              onClick={handleSendMoney}
              className="w-full py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        ) : (
          <h1 className="text-base font-semibold text-center">
            User Not Found
          </h1>
        )}
      </div>

      <button
        onClick={() => navigate("/transactions")}
        className="mt-4 w-full max-w-md py-2 bg-gray-700 text-white rounded text-sm hover:bg-gray-800"
      >
        See All Transactions
      </button>
    </div>
  );
};

export default Dashboard;
