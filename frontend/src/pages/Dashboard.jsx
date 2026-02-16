import { useEffect, useState } from "react";
import API from "../api/axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const { data } = await API.get("/transactions?limit=100");
    setTransactions(data.transactions);

    // Calculate total
    const totalAmount = data.transactions.reduce(
      (acc, item) => acc + item.amount,
      0,
    );
    setTotal(totalAmount);

    // Category breakdown
    const categoryMap = {};
    data.transactions.forEach((item) => {
      categoryMap[item.category] =
        (categoryMap[item.category] || 0) + item.amount;
    });

    const chartArr = Object.keys(categoryMap).map((key) => ({
      name: key,
      value: categoryMap[key],
    }));

    setChartData(chartArr);
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Total Summary */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold">Total Expenses</h2>
        <p className="text-3xl text-red-500 mt-2">₹ {total}</p>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={chartData} dataKey="value" outerRadius={100} label>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No data available</p>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>

        {transactions.slice(0, 5).map((txn) => (
          <div key={txn._id} className="flex justify-between border-b py-2">
            <span>{txn.title}</span>
            <span className="text-red-500">₹ {txn.amount}</span>
          </div>
        ))}

        {transactions.length === 0 && (
          <p className="text-gray-500">No transactions yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
