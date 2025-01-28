import { supabase } from "@/utils/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, menuId, quantity } = req.body;

    console.log("Received body:", req.body);

    if (!userId || !menuId || !quantity) {
      return res.status(400).json({
        error: "Missing required fields",
        details: { userId, menuId, quantity },
      });
    }

    try {
      // Supabase에 데이터 삽입 또는 업데이트
      const { data, error } = await supabase
        .from("cart")
        .upsert(
          { user_id: userId, menu_id: menuId, quantity },
          { onConflict: ["user_id", "menu_id"] }
        );

      if (error) throw error;

      res.status(200).json({ message: "Item added to cart", data });
    } catch (err) {
      console.error("Error adding item to cart:", err.message);
      res.status(500).json({ error: "Internal server error" });
    }
  } else if (req.method === "GET") {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id" });
    }

    try {
      // 1️⃣ cart 테이블에서 menu_id와 quantity 가져오기
      const { data: cartItems, error: cartError } = await supabase
        .from("cart")
        .select("menu_id, quantity")
        .eq("user_id", user_id);
      if (cartError) throw cartError;

      if (!cartItems || cartItems.length === 0) {
        return res.status(200).json({ cartItems: [] });
      }

      // 2️⃣ menu 테이블에서 name과 cost 가져오기
      const menuIds = cartItems.map((item) => item.menu_id);
      const { data: menuItems, error: menuError } = await supabase
        .from("menu")
        .select("id, name, cost")
        .in("id", menuIds);

      if (menuError) throw menuError;

      // 3️⃣ cart와 menu 데이터를 병합
      const cartWithDetails = cartItems.map((cartItem) => ({
        quantity: cartItem.quantity,
        ...menuItems.find((menuItem) => menuItem.id === cartItem.menu_id),
      }));

      console.log("Cart Items with Menu Details:", cartWithDetails);
      res.status(200).json({ cartItems: cartWithDetails });
    } catch (err) {
      console.error("Error fetching cart:", err.message);
      res
        .status(500)
        .json({ error: "Internal server error", details: err.message });
    }
  } else if (req.method === "DELETE") {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "Missing user_id" });
    }

    try {
      // Supabase에서 해당 user_id의 장바구니 데이터 삭제
      const { error } = await supabase
        .from("cart")
        .delete()
        .eq("user_id", user_id);

      if (error) {
        console.error("Supabase DELETE error:", error);
        throw error;
      }

      res.status(200).json({ message: "Cart cleared successfully" });
    } catch (err) {
      console.error("Error clearing cart:", err.message);
      res
        .status(500)
        .json({ error: "Internal server error", details: err.message });
    }
  } else {
    res.setHeader("Allow", ["POST", "GET", "DELETE"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
