// pages/api/register.js
import bcrypt from "bcryptjs";
import { supabase } from "@/utils/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: "모든 필드를 입력해주세요." });
    }

    try {
      // 1. Supabase auth에 사용자 등록
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email,
        password, // Supabase가 자체적으로 비밀번호를 해싱함
      });
      if (authError) throw authError;

      // 2. profiles 테이블에 사용자 정보 추가
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authUser.user.id, // Supabase auth에서 생성된 UUID 연결
          full_name: name,
          user_id: email, // 사용자 식별용 이메일
          password: await bcrypt.hash(password, 10), // 추가 보안성을 위해 별도로 해싱해서 저장 (옵션)
        },
      ]);
      if (profileError) throw profileError;

      res.status(200).json({ message: "회원가입 성공!" });
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error.message);
      res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
