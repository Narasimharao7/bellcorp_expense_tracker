import { useEffect, useState } from "react";
import API from "../api/axios";
import TransactionForm from "../components/TransactionForm";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, [page, search, category]);

  const fetchTransactions = async () => {
    const { data } = await API.get(
      `/transactions?page=${page}&search=${search}&category=${category}`,
    );
    setTransactions(data.transactions);
    setTotalPages(data.totalPages);
  };

  const addOrUpdateTransaction = async (form) => {
    if (selected) {
      await API.put(`/transactions/${selected._id}`, form);
      setSelected(null);
    } else {
      await API.post("/transactions", form);
    }
    fetchTransactions();
  };

  const deleteTransaction = async (id) => {
    await API.delete(`/transactions/${id}`);
    fetchTransactions();
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Transaction Explorer</h1>

      <TransactionForm onSubmit={addOrUpdateTransaction} selected={selected} />

      {/* Search & Filter */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded"
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filter by category"
          className="border p-2 rounded"
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded shadow">
        {transactions.length > 0 ? (
          transactions.map((txn) => (
            <div
              key={txn._id}
              className="flex justify-between items-center border-b p-3"
            >
              <div>
                <h3 className="font-semibold">{txn.title}</h3>
                <p className="text-sm text-gray-500">
                  {txn.category} | {new Date(txn.date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-3 items-center">
                <span className="text-red-500 font-bold">₹ {txn.amount}</span>

                <button
                  onClick={() => setSelected(txn)}
                  className="text-blue-500"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTransaction(txn._id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-gray-500">No transactions found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-3">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Transactions;
