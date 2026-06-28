import { Link } from "react-router-dom";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  return (
    <div className="order-success-page">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h2>Order Placed Successfully!</h2>
        <p>Thank you for shopping with FreshKart. Your order has been confirmed.</p>
        <p className="success-subtext">You will receive your items soon.</p>

        <div className="success-actions">
          <Link to="/myorders" className="view-orders-btn">
            View My Orders
          </Link>
          <Link to="/" className="continue-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
