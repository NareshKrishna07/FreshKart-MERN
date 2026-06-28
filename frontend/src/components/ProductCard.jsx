import { useCart } from "../context/CartContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const {
  addToCart,
  cartItems,
  increaseQuantity,
  decreaseQuantity,
} = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };
  const cartItem = cartItems.find(
  (item) => item._id === product._id
);

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-description">{product.description}</p>
        <div className="product-bottom">
          <span className="product-price">₹{product.price}</span>
          {
  cartItem ? (
    <div className="quantity-selector">
      <button
        className="qty-btn"
        onClick={() => decreaseQuantity(product._id)}
      >
        -
      </button>

      <span className="qty-value">
        {cartItem.quantity}
      </span>

      <button
        className="qty-btn"
        onClick={() => increaseQuantity(product._id)}
      >
        +
      </button>
    </div>
  ) : (
    <button
      onClick={handleAddToCart}
      className="add-to-cart-btn"
    >
      Add to Cart
    </button>
  )
}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
