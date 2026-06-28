import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./Checkout.css";

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: user?.name || "",
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const validateAddress = () => {
    return (
      address.fullName && address.address && address.city && address.pincode && address.phone
    );
  };

  // this function does the full payment flow:
  // 1. create razorpay order on backend
  // 2. open razorpay checkout popup
  // 3. on success, verify payment on backend
  // 4. only then, create the order in our database
  const handlePayment = async () => {
    setError("");

    if (!validateAddress()) {
      setError("Please fill in all shipping address fields");
      return;
    }

    setProcessing(true);

    try {
      // STEP 1: create razorpay order from our backend
      const orderResponse = await api.post(
        "/payment/create-order",
        { amount: cartTotal },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { orderId, amount, currency, keyId } = orderResponse.data;

      // STEP 2: configure and open razorpay checkout popup
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "FreshKart",
        description: "Order Payment",
        order_id: orderId,
        handler: async function (response) {
          // this runs when payment is successful
          // response contains razorpay_order_id, razorpay_payment_id, razorpay_signature
          await verifyPaymentAndPlaceOrder(response);
        },
        prefill: {
          name: address.fullName,
          contact: address.phone,
        },
        theme: {
          color: "#1a7f37",
        },
        modal: {
          // this runs if user closes the popup without paying
          ondismiss: function () {
            setProcessing(false);
            setError("Payment was cancelled. Please try again.");
          },
        },
      };

      const razorpayWindow = new window.Razorpay(options);
      razorpayWindow.open();
    } catch (err) {
      console.log("Payment initiation error:", err.message);
      setError("Failed to start payment. Please try again.");
      setProcessing(false);
    }
  };

  // STEP 3 and 4: verify payment, then place order
  const verifyPaymentAndPlaceOrder = async (paymentResponse) => {
    try {
      const verifyRes = await api.post(
        "/payment/verify",
        {
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!verifyRes.data.verified) {
        setError("Payment verification failed. Please contact support.");
        setProcessing(false);
        return;
      }

      // payment verified! now place the order in our DB
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      await api.post(
        "/orders",
        {
          items: orderItems,
          totalAmount: cartTotal,
          shippingAddress: address,
          paymentInfo: {
            razorpayOrderId: paymentResponse.razorpay_order_id,
            razorpayPaymentId: paymentResponse.razorpay_payment_id,
            razorpaySignature: paymentResponse.razorpay_signature,
          },
          paymentStatus: "paid",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // clear the cart and redirect to success page
      clearCart();
      navigate("/order-success");
    } catch (err) {
      console.log("Order placement error:", err.message);
      setError("Payment succeeded but order placement failed. Please contact support.");
      setProcessing(false);
    }
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-container">
        <div className="address-section">
          <h3>Shipping Address</h3>

          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={address.fullName}
            onChange={handleAddressChange}
          />

          <label>Address</label>
          <input
            type="text"
            name="address"
            value={address.address}
            onChange={handleAddressChange}
            placeholder="House no, Street, Area"
          />

          <label>City</label>
          <input type="text" name="city" value={address.city} onChange={handleAddressChange} />

          <label>Pincode</label>
          <input
            type="text"
            name="pincode"
            value={address.pincode}
            onChange={handleAddressChange}
          />

          <label>Phone Number</label>
          <input type="text" name="phone" value={address.phone} onChange={handleAddressChange} />
        </div>

        <div className="order-summary-section">
          <h3>Order Summary</h3>

          {cartItems.map((item) => (
            <div key={item._id} className="summary-item">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <div className="summary-total">
            <span>Total</span>
            <span>₹{cartTotal}</span>
          </div>

          {error && <p className="checkout-error">{error}</p>}

          <button onClick={handlePayment} disabled={processing} className="pay-now-btn">
            {processing ? "Processing..." : `Pay ₹${cartTotal} with Razorpay`}
          </button>

          <p className="payment-note">🔒 Secure payment powered by Razorpay</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
