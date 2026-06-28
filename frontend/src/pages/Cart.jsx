import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Cart.css";

const Cart = () => {
  const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart, cartTotal } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // when user clicks checkout, check login status first
  const handleCheckout = () => {
    if (!isLoggedIn) {
      // send them to login, and remember to bring them back to checkout after
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      navigate("/checkout");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <button onClick={() => navigate("/")} className="continue-shopping-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2 className="cart-heading">Your Cart</h2>

      <div className="cart-items-list">
        {cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />

            <div className="cart-item-details">
              <h4>{item.name}</h4>
              <p className="cart-item-price">₹{item.price} each</p>
            </div>

            <div className="quantity-controls">
              <button onClick={() => decreaseQuantity(item._id)} className="qty-btn">
                -
              </button>
              <span className="qty-value">{item.quantity}</span>
              <button onClick={() => increaseQuantity(item._id)} className="qty-btn">
                +
              </button>
            </div>

            <div className="cart-item-subtotal">₹{item.price * item.quantity}</div>

            <button onClick={() => removeFromCart(item._id)} className="remove-btn">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-total-row">
          <span>Total Amount:</span>
          <span className="cart-total-amount">₹{cartTotal}</span>
        </div>

        <button onClick={handleCheckout} className="checkout-btn">
          {isLoggedIn ? "Proceed to Checkout" : "Login to Checkout"}
        </button>

        {!isLoggedIn && (
          <p className="login-note">You need to login before placing an order</p>
        )}
      </div>
    </div>
  );
};

export default Cart;
