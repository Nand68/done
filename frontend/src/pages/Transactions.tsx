/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Transaction {
  transactionId: string;
  senderId: string;
  receiverId: string;
  amount: number;
  transactionType: string;
  createdAt: string;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/transaction/all", {
          withCredentials: true,
        });
        if (res.data.ok) {
          setTransactions(res.data.transactions);
        } else {
          toast.error(res.data.error || "Could not fetch transactions");
        }
      } catch (err: any) {
        toast.error(err.response?.data?.error || err.message);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-[90%] max-w-2xl p-4 border rounded bg-white">
        <h2 className="text-lg font-medium mb-4">Your Transactions</h2>
        {transactions.length > 0 ? (
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">ID</th>
                <th className="border px-2 py-1">Sender</th>
                <th className="border px-2 py-1">Receiver</th>
                <th className="border px-2 py-1">Amount</th>
                <th className="border px-2 py-1">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.transactionId}>
                  <td className="border px-2 py-1">{tx.transactionId}</td>
                  <td className="border px-2 py-1">{tx.senderId}</td>
                  <td className="border px-2 py-1">{tx.receiverId}</td>
                  <td className="border px-2 py-1">₹{tx.amount}</td>
                  <td className="border px-2 py-1">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
