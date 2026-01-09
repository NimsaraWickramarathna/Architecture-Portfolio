"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./projects-admin.module.css";

import { projects as seedProjects } from "../../../data/projects";

type ProjectRow = {
  id: string;
  slug: string;
  category: string;
  title: string;
  createdAt: string;
};

const LS_KEY = "admin_projects";

function formatDate(dateISO: string) {
  const d = new Date(dateISO);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function loadRows(): ProjectRow[] {
  // 1) try localStorage
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as ProjectRow[];
    }
  } catch {}

  // 2) seed if empty
  const seeded: ProjectRow[] = seedProjects.map((p) => ({
    id: p.id,
    slug: p.slug,
    category: p.category,
    title: p.title,
    createdAt: p.createdAt,
  }));

  try {
    localStorage.setItem(LS_KEY, JSON.stringify(seeded));
  } catch {}

  return seeded;
}

function saveRows(rows: ProjectRow[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(rows));
}

export default function AdminProjectsPage() {
  const router = useRouter();

  // ✅ Protect this page (demo)
  useEffect(() => {
    const ok = localStorage.getItem("admin_demo_session") === "true";
    if (!ok) router.replace("/admin/login");
  }, [router]);

  const [rows, setRows] = useState<ProjectRow[]>(() => loadRows());

  // ✅ Update if changed in another tab
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== LS_KEY) return;
      setRows(loadRows());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const sorted = useMemo(() => {
    return rows
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [rows]);

  function onDelete(id: string) {
    const ok = confirm("Delete this project? (This will remove it from localStorage)");
    if (!ok) return;

    setRows((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveRows(updated);
      return updated;
    });
  }

  return (
    <main className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.title}>Manage Projects</h1>
          <p className={styles.subtitle}>
            Add, edit, and organize your portfolio projects (Owner only).
          </p>
        </div>

        <div className={styles.topActions}>
          <Link href="/admin/dashboard" className={styles.secondaryBtn}>
            ← Dashboard
          </Link>
          <Link href="/admin/projects/new" className={styles.primaryBtn}>
            + Add Project
          </Link>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div className={styles.count}>
            Total: <b>{sorted.length}</b>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Created</th>
                <th className={styles.actionsCol}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {sorted.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className={styles.titleCell}>
                      <div className={styles.name}>{p.title}</div>
                      <div className={styles.meta}>Slug: {p.slug}</div>
                    </div>
                  </td>

                  <td>
                    <span className={styles.badge}>{p.category}</span>
                  </td>

                  <td>{formatDate(p.createdAt)}</td>

                  <td className={styles.actionsCol}>
                    <div className={styles.actions}>
                      <Link className={styles.linkBtn} href={`/admin/projects/${p.id}/edit`}>
                        Edit
                      </Link>

                      <Link
                        className={styles.linkBtn}
                        href={`/projects/${p.slug}`}
                        target="_blank"
                      >
                        View
                      </Link>

                      <button
                        type="button"
                        className={styles.dangerBtn}
                        onClick={() => onDelete(p.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!sorted.length ? (
                <tr>
                  <td colSpan={4} className={styles.empty}>
                    No projects yet. Click <b>+ Add Project</b> to create one.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className={styles.bottomRow}>
          <Link href="/projects" className={styles.secondaryBtn} target="_blank">
            View Public Projects Page
          </Link>
        </div>
      </div>
    </main>
  );
}
