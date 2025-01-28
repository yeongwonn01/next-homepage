// components/ProtectedRoute.js
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login"); // 로그인 페이지로 리다이렉트
    }
  }, [user]);

  if (!user) {
    return null; // 로딩 상태 표시
  }

  return <>{children}</>;
}
