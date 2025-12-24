import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800 }}>404 - Page Not Found</h1>
      <p style={{ marginTop: 8 }}>
        The page you are looking for doesn’t exist.
      </p>

      <div style={{ marginTop: 16 }}>
        <Link href="/">Go back home</Link>
      </div>
    </main>
  );
}
