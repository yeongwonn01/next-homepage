import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext"; // 로그인된 사용자 정보 가져오기
import Header from "@/components/Header"; // 상단 헤더 컴포넌트

export default function Cart() {
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
  const [cartItems, setCartItems] = useState([]); // 장바구니 아이템 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 장바구니 데이터 가져오기
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/cart?user_id=${user.id}`); // API 호출
        if (!response.ok) {
          throw new Error("Failed to fetch cart items"); // 에러 처리
        }
        const data = await response.json();
        console.log("Fetched Cart Items:", data.cartItems); // 디버깅용 로그
        setCartItems(data.cartItems); // API에서 받아온 데이터를 설정
      } catch (err) {
        console.error("Error fetching cart:", err.message);
        setError(err.message);
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    };

    fetchCartItems();
  }, [user]);

  // 장바구니 비우기
  const handleClearCart = async () => {
    if (!user) {
      setError("You must be logged in to clear the cart.");
      return;
    }

    try {
      const response = await fetch(`/api/cart?user_id=${user.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to clear cart");
      }

      setCartItems([]); // 장바구니 상태 업데이트
    } catch (err) {
      console.error("Error clearing cart:", err.message);
      setError(err.message);
    }
  };

  if (isLoading) return <p>Loading your cart...</p>; // 로딩 상태 표시
  if (error) return <p className="error-message">{error}</p>; // 에러 메시지 표시

  // 총 금액 계산
  const totalPrice = cartItems.reduce(
    (total, item) => total + (item.cost || 0) * item.quantity,
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
                <p>Item: {item.name || "Unknown"}</p>
                <p>Price: ${item.cost?.toFixed(2) || "0.00"}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            ))}
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button className="checkout-btn">Proceed to Checkout</button>
            <button className="clear-cart-btn" onClick={handleClearCart}>
              Clear Cart
            </button>
          </>
        )}
      </main>
    </div>
  );
}
