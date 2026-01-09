"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./login.module.css";

export default function AdminLoginPage() {
  // Demo owner credentials (TEMPORARY - frontend only)
  // Later we will replace this with API: /api/auth/login + /api/auth/verify-otp
  const DEMO_OWNER_EMAIL = "owner@creator.com";
  const DEMO_OWNER_PASSWORD = "Admin@123";

  const [step, setStep] = useState<"credentials" | "otp">("credentials");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const maskedEmail = useMemo(() => {
    if (!email.includes("@")) return email;
    const [u, d] = email.split("@");
    if (u.length <= 2) return `**@${d}`;
    return `${u.slice(0, 2)}***@${d}`;
  }, [email]);

  function generateOtp() {
    // 6 digit OTP
    const code = String(Math.floor(100000 + Math.random() * 900000));
    return code;
  }

  function onSubmitCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    // TEMP check (frontend only)
    if (email.trim().toLowerCase() !== DEMO_OWNER_EMAIL.toLowerCase() || password !== DEMO_OWNER_PASSWORD) {
      setError("Invalid owner credentials.");
      return;
    }

    const code = generateOtp();
    setGeneratedOtp(code);
    setStep("otp");
    setInfo(`OTP sent to ${maskedEmail} (demo mode).`);
  }

  function onSubmitOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    // TEMP check (frontend only)
    if (otp !== generatedOtp) {
      setError("Invalid OTP. Try again.");
      return;
    }

    // TEMP session flag (frontend only)
    // Later we will replace this with HTTP-only cookie session from backend.
    localStorage.setItem("admin_demo_session", "true");

    // Redirect to admin dashboard
    window.location.href = "/admin/dashboard";
  }

  function resendOtp() {
    const code = generateOtp();
    setGeneratedOtp(code);
    setOtp("");
    setInfo(`New OTP sent to ${maskedEmail} (demo mode).`);
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.topRow}>
          <div>
            <h1 className={styles.title}>Admin Login</h1>
            <p className={styles.subtitle}>Owner access only</p>
          </div>

          <Link href="/" className={styles.backLink}>
            ← Back to site
          </Link>
        </div>

        {info ? <div className={styles.info}>{info}</div> : null}
        {error ? <div className={styles.error}>{error}</div> : null}

        {step === "credentials" ? (
          <>
            <form onSubmit={onSubmitCredentials} className={styles.form}>
              <label className={styles.label}>
                Email
                <input
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@creator.com"
                  autoComplete="email"
                />
              </label>

              <label className={styles.label}>
                Password
                <input
                  className={styles.input}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </label>

              <button className={styles.primaryBtn} type="submit">
                Continue
              </button>

              <div className={styles.note}>
                <b>Demo credentials (temporary):</b>
                <br />
                Email: <code>owner@creator.com</code>
                <br />
                Password: <code>Admin@123</code>
              </div>
            </form>
          </>
        ) : (
          <>
            <form onSubmit={onSubmitOtp} className={styles.form}>
              <div className={styles.otpHeader}>
                <h2 className={styles.otpTitle}>Enter OTP</h2>
                <p className={styles.otpSub}>We sent a 6-digit code to {maskedEmail}</p>
              </div>

              <label className={styles.label}>
                OTP Code
                <input
                  className={styles.input}
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                />
              </label>

              <button className={styles.primaryBtn} type="submit">
                Verify &amp; Login
              </button>

              <div className={styles.actionsRow}>
                <button type="button" className={styles.linkBtn} onClick={resendOtp}>
                  Resend OTP
                </button>
                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() => {
                    setStep("credentials");
                    setOtp("");
                    setGeneratedOtp("");
                    setInfo("");
                    setError("");
                  }}
                >
                  Change email/password
                </button>
              </div>

              {/* Demo-only: shows OTP so you can test quickly */}
              <div className={styles.note}>
                <b>Demo OTP (temporary):</b> <code>{generatedOtp || "------"}</code>
              </div>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
