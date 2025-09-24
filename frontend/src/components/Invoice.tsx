/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

interface Transaction {
  transactionId: string;
  senderId: string;
  receiverId: string;
  amount: number;
  createdAt: string;
}

const Invoice = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/transaction/all-users",
          {
            withCredentials: true,
          }
        );

        if (res.data.ok) {
          setTransactions(res.data.transactions);
        }
      } catch (err: any) {
        console.error("Failed to fetch transactions:", err);
      }
    };
    fetchTransactions();
  }, []);

  const downloadButtonHandler = () => {
    const element = document.querySelector("#invoice") as HTMLElement | null;
    if (element) {
      html2pdf(element, {
        margin: 20,
        filename: `transactions_${new Date().toISOString()}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      });
    }
  };

  return (
    <div className="p-4">
      <div id="invoice" className="border p-4 rounded bg-white">
        <h2 className="text-lg font-semibold mb-4">Transactions Invoice</h2>
        <div className="grid grid-cols-5 gap-2 font-medium mb-2 border-b pb-1">
          <div>ID</div>
          <div>Sender</div>
          <div>Receiver</div>
          <div>Amount</div>
          <div>Date</div>
        </div>
        {transactions.map((tx) => (
          <div
            key={tx.transactionId}
            className="grid grid-cols-5 gap-2 mb-1 text-sm border-b pb-1"
          >
            <div>{tx.transactionId}</div>
            <div>{tx.senderId}</div>
            <div>{tx.receiverId}</div>
            <div>₹{tx.amount}</div>
            <div>{new Date(tx.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
      <button
        onClick={downloadButtonHandler}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Download PDF
      </button>
    </div>
  );
};

export default Invoice;
