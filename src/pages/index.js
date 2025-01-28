import Header from "@/components/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <main className="main-content">
        <div className="bakery-info">
          <h2>Today&apos;s Bakery</h2>
          <img src="/bread.jpg" alt="Bread" className="bread-image" />
        </div>
      </main>
    </div>
  );
}
