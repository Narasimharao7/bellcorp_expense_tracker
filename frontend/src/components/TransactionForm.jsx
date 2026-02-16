import { useState, useEffect } from "react";

const TransactionForm = ({ onSubmit, selected }) => {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    notes: "",
  });

  useEffect(() => {
    if (selected) {
      setForm(selected);
    }
  }, [selected]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      title: "",
      amount: "",
      category: "",
      date: "",
      notes: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-lg font-bold mb-3">
        {selected ? "Edit Transaction" : "Add Transaction"}
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <input
          type="text"
          placeholder="Category"
          value={form.category}
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <input
          type="date"
          value={form.date?.substring(0, 10)}
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
      </div>

      <textarea
        placeholder="Notes"
        value={form.notes}
        className="border p-2 rounded w-full mt-3"
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />

      <button className="bg-blue-600 text-white px-4 py-2 mt-3 rounded">
        {selected ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default TransactionForm;
