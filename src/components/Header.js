import Link from "next/link";

export default function Header() {
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
        <Link href="/cart" className="nav-item">
          CART
        </Link>
      </nav>
    </header>
  );
}
