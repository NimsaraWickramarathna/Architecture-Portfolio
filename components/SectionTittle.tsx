export default function SectionTitle({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="section-title">
      <h2>{title}</h2>
      <p>{desc}</p>
    </div>
  );
}
