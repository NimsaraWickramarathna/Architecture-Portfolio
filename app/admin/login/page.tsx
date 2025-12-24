import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800 }}>Admin Login</h1>
      <p style={{ marginTop: 8 }}>
        Later we add password + OTP here.
      </p>

      <div style={{ marginTop: 16 }}>
        <Link href="/admin/dashboard">Go to dashboard (temporary)</Link>
      </div>
    </main>
  );
}
