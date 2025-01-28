import Header from "@/components/Header";
import { useCart } from "@/context/CartContext";

export default function Cart() {
  const { cartItems, clearCart } = useCart();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div>
      <Header />
      <main className="cart-content">
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <p>{item.name}</p>
                <p>
                  ${item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
            ))}
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button className="checkout-btn">Proceed to Checkout</button>
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          </>
        )}
      </main>
    </div>
  );
}
