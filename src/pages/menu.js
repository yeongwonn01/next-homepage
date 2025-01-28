import { useState } from "react";
//import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext"; // 유저 정보 가져오기
import Header from "@/components/Header";

const menuData = {
  breads: [
    { id: 1, name: "Croissant", price: 3.5, image: "/croissant.jpg" },
    { id: 2, name: "Baguette", price: 2.5, image: "/baguette.jpg" },
    { id: 3, name: "Rye Bread", price: 4.0, image: "/rye_bread.jpg" },
    { id: 4, name: "Whole Wheat Bread", price: 3.8, image: "/whole_wheat.jpg" },
    { id: 5, name: "Sourdough", price: 5.0, image: "/sourdough.jpg" },
    { id: 6, name: "Ciabatta", price: 3.2, image: "/ciabatta.jpg" },
    { id: 7, name: "Multigrain Bread", price: 4.5, image: "/multigrain.jpg" },
    { id: 8, name: "Focaccia", price: 4.8, image: "/focaccia.jpg" },
    { id: 9, name: "Challah", price: 5.5, image: "/challah.jpg" },
  ],
  desserts: [
    { id: 10, name: "Macaron", price: 1.5, image: "/macaron.jpg" },
    { id: 11, name: "Tiramisu", price: 5.5, image: "/tiramisu.jpg" },
    { id: 12, name: "Brownie", price: 3.0, image: "/brownie.jpg" },
    { id: 13, name: "Cheesecake", price: 6.5, image: "/cheesecake.jpg" },
    { id: 14, name: "Eclair", price: 4.0, image: "/eclair.jpg" },
    { id: 15, name: "Muffin", price: 2.8, image: "/muffin.jpg" },
    { id: 16, name: "Donut", price: 2.5, image: "/donut.jpg" },
    { id: 17, name: "Pavlova", price: 5.8, image: "/pavlova.jpg" },
    { id: 18, name: "Panna Cotta", price: 4.8, image: "/panna_cotta.jpg" },
  ],
  drinks: [
    { id: 19, name: "Americano", price: 2.5, image: "/americano.jpg" },
    { id: 20, name: "Latte", price: 3.5, image: "/latte.jpg" },
    { id: 21, name: "Orange Juice", price: 4.0, image: "/orange_juice.jpg" },
    { id: 22, name: "Espresso", price: 2.0, image: "/espresso.jpg" },
    { id: 23, name: "Cappuccino", price: 3.8, image: "/cappuccino.jpg" },
    { id: 24, name: "Mocha", price: 4.2, image: "/mocha.jpg" },
    { id: 25, name: "Green Tea", price: 2.5, image: "/green_tea.jpg" },
    { id: 26, name: "Iced Coffee", price: 3.0, image: "/iced_coffee.jpg" },
    { id: 27, name: "Hot Chocolate", price: 3.8, image: "/hot_chocolate.jpg" },
  ],
};

export default function Menu() {
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
  const [activeCategory, setActiveCategory] = useState("breads");
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [, setError] = useState(null);

  const handleItemClick = (item) => {
    if (selectedItem && selectedItem.id === item.id) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  const handleQuantityChange = (event, itemId, change) => {
    event.stopPropagation();
    setSelectedQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: Math.max(1, (prevQuantities[itemId] || 1) + change),
    }));
  };

  const handleAddToCart = async (event) => {
    event.stopPropagation();
    if (!user) {
      setError("You must be logged in to add items to the cart.");
      return;
    }

    if (selectedItem) {
      const quantity = selectedQuantities[selectedItem.id] || 1;
      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            menuId: selectedItem.id,
            quantity,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to add item to cart");
        }

        setSelectedItem(null);
        setSelectedQuantities((prev) => ({ ...prev, [selectedItem.id]: 1 }));
        setError(null);
      } catch (err) {
        console.error("Error adding item to cart:", err.message);
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <Header />
      <main className="menu-content">
        <div className="menu-categories">
          <button onClick={() => setActiveCategory("breads")}>Breads</button>
          <button onClick={() => setActiveCategory("desserts")}>
            Desserts
          </button>
          <button onClick={() => setActiveCategory("drinks")}>Drinks</button>
        </div>
        <div className="menu-grid">
          {menuData[activeCategory].map((item) => (
            <div
              key={item.id}
              className={`menu-item ${
                selectedItem?.id === item.id ? "expanded" : ""
              }`}
              onClick={() => handleItemClick(item)}
            >
              <img
                src={item.image}
                alt={item.name}
                className="menu-item-image"
              />
              <p className="menu-item-name">{item.name}</p>
              <p className="menu-item-price">${item.price.toFixed(2)}</p>
              {selectedItem?.id === item.id && (
                <div
                  className="item-options"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={(e) => handleQuantityChange(e, item.id, -1)}
                    >
                      ➖
                    </button>
                    <span className="quantity-value">
                      {selectedQuantities[item.id] || 1}
                    </span>
                    <button
                      className="quantity-btn"
                      onClick={(e) => handleQuantityChange(e, item.id, 1)}
                    >
                      ➕
                    </button>
                  </div>
                  <button className="add-to-cart-btn" onClick={handleAddToCart}>
                    Add to Cart
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
