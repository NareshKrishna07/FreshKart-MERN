import { useState, useEffect } from "react";
import api from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import "./MyOrders.css";

const MyOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get("/orders/myorders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(response.data);
      } catch (err) {
        console.log("Error fetching orders:", err.message);
        setError("Failed to load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return <div className="loading-text">Loading your orders...</div>;
  }

  if (error) {
    return <div className="error-text">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="myorders-page">
        <div className="no-orders">
          <h2>No orders yet</h2>
          <p>Start shopping to place your first order!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="myorders-page">
      <h2>My Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className="order-card">
          <div className="order-header">
            <div>
              <span className="order-id">Order #{order._id.slice(-8).toUpperCase()}</span>
              <span className="order-date">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <span className={`order-status status-${order.orderStatus}`}>
              {order.orderStatus}
            </span>
          </div>

          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item-row">
                <img src={item.image} alt={item.name} className="order-item-img" />
                <span className="order-item-name">
                  {item.name} x {item.quantity}
                </span>
                <span className="order-item-price">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="order-footer">
            <span>Payment: {order.paymentStatus === "paid" ? "✓ Paid" : order.paymentStatus}</span>
            <span className="order-total">Total: ₹{order.totalAmount}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
