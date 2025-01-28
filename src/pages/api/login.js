import bcrypt from "bcryptjs";
import { supabase } from "@/utils/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      // profiles 테이블에서 사용자 정보 가져오기
      const { data: user, error } = await supabase
        .from("profiles")
        .select("id, full_name, password") // password는 해싱된 비밀번호
        .eq("user_id", email)
        .single();

      if (error || !user) {
        return res.status(404).json({ error: "User not found" });
      }

      // 비밀번호 검증
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      // 로그인 성공 응답
      res.status(200).json({
        message: "Login successful",
        user: { id: user.id, full_name: user.full_name },
        token: "mock-token-for-now", // JWT 또는 실제 토큰 사용 가능
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
