import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="bg-gray-900 text-white p-4 flex justify-between">
      <Link to="/" className="font-bold text-lg">
        Bellcorp Tracker
      </Link>

      {user && (
        <div className="flex gap-4">
          <Link to="/transactions">Transactions</Link>
          <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
