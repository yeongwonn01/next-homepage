export default function MenuItem({ name, price, image }) {
  return (
    <div className="menu-item">
      <img src={image} alt={name} className="bread-image" />
      <p>{name}</p>
      <p>${price}</p>
    </div>
  );
}
