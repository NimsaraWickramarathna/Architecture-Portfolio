import Link from "next/link";

export default function ProjectsPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800 }}>Projects</h1>
      <p style={{ marginTop: 8 }}>This will be the projects list page.</p>

      {/* Temporary link to a sample details page */}
      <div style={{ marginTop: 16 }}>
        <Link href="/projects/sample-project">Open sample project details</Link>
      </div>
    </main>
  );
}
