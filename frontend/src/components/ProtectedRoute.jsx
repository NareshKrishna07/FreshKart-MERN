import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// this component wraps pages that need login
// e.g. checkout page, my orders page
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;
  }

  if (!isLoggedIn) {
    // redirect to login if not logged in
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
