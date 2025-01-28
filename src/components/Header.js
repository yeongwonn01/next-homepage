import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout(); // 로그아웃 처리
    router.push("/"); // 홈으로 이동
  };

  return (
    <header className="header">
      <Link href="/" className="logo">
        BROWN BREAD
      </Link>
      <nav className="nav-menu">
        <Link href="/location" className="nav-item">
          LOCATION
        </Link>
        <Link href="/menu" className="nav-item">
          MENU
        </Link>
        <Link
          href={user ? "/cart" : "/login"}
          className={
            router.pathname === "/cart" ? "nav-item active" : "nav-item"
          }
        >
          CART
        </Link>
        {user ? (
          <Link href="/" className="nav-item" onClick={handleLogout}>
            LOGOUT
          </Link>
        ) : (
          <Link href="/login" className="nav-item">
            LOGIN
          </Link>
        )}
      </nav>
    </header>
  );
}
