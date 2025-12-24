import Link from "next/link";

export default function BlogsPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800 }}>Blogs</h1>
      <p style={{ marginTop: 8 }}>This will be the blog list page.</p>

      {/* Temporary link */}
      <div style={{ marginTop: 16 }}>
        <Link href="/blogs/sample-blog">Open sample blog details</Link>
      </div>
    </main>
  );
}
