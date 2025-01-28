import { createContext, useState, useContext } from "react";

// 장바구니 Context 생성
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // 장바구니에 상품 추가 (선택한 수량 반영)
  const addToCart = (item) => {
    setCartItems((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity } // 🆕 사용자가 선택한 수량 반영
            : cartItem
        );
      }
      return [...prevCart, { ...item }]; // 🆕 새 아이템은 그대로 추가 (quantity 포함)
    });
  };

  // 장바구니 비우기 기능
  const clearCart = () => {
    setCartItems([]); // 장바구니 초기화
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// 전역에서 장바구니 상태 쉽게 사용하도록 훅 생성
export function useCart() {
  return useContext(CartContext);
}
