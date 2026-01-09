"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./blogs-admin.module.css";

import { blogs as seedBlogs } from "../../../data/blogs";

type BlogRow = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  createdAt: string; // YYYY-MM-DD or ISO
  image?: string; // cover (base64 or url)
  content?: string;
};

type SeedBlog = {
  id?: number | string;
  slug?: string;
  category?: string;
  title?: string;
  excerpt?: string;
  createdAt?: string;
  image?: string;
  coverImage?: string;
  content?: string;
};

const LS_KEY = "admin_blogs";

// ✅ change this if your public blog route is different
const PUBLIC_BLOG_BASE = "/blogs"; // e.g. "/blog" if you use /blog/[slug]

function formatDate(dateISO: string) {
  const d = new Date(dateISO);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function normalizeDate(value: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function loadRows(): BlogRow[] {
  // 1) localStorage
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as BlogRow[];
    }
  } catch {}

  // 2) seed once
  const seeded: BlogRow[] = (seedBlogs as SeedBlog[]).map((b) => ({
    id: String(b.id),
    slug: b.slug || "",
    category: b.category || "Design",
    title: b.title || "",
    excerpt: b.excerpt || "",
    createdAt: normalizeDate(b.createdAt || ""),
    image: b.image || b.coverImage || "",
    content: b.content || "",
  }));

  try {
    localStorage.setItem(LS_KEY, JSON.stringify(seeded));
  } catch {}

  return seeded;
}

function saveRows(rows: BlogRow[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(rows));
}

export default function AdminBlogsPage() {
  const router = useRouter();

  // ✅ Protect (demo)
  useEffect(() => {
    const ok = localStorage.getItem("admin_demo_session") === "true";
    if (!ok) router.replace("/admin/login");
  }, [router]);

  const [rows, setRows] = useState<BlogRow[]>(() => loadRows());
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== LS_KEY) return;
      setRows(loadRows());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .slice()
      .filter((b) => {
        if (!q) return true;
        return (
          b.title.toLowerCase().includes(q) ||
          b.slug.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          (b.excerpt || "").toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [rows, query]);

  function onDelete(id: string) {
    const ok = confirm("Delete this blog? (This will remove it from localStorage)");
    if (!ok) return;

    setRows((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      saveRows(updated);
      return updated;
    });
  }

  return (
    <main className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.title}>Manage Blogs</h1>
          <p className={styles.subtitle}>Create, edit, and organize your blog posts (Owner only).</p>
        </div>

        <div className={styles.topActions}>
          <Link href="/admin/dashboard" className={styles.secondaryBtn}>
            ← Dashboard
          </Link>
          <Link href="/admin/blogs/new" className={styles.primaryBtn}>
            + Add Blog
          </Link>
        </div>
      </div>

      <div className={styles.controlsCard}>
        <div className={styles.controlsRow}>
          <div className={styles.searchBox}>
            <i className={`fas fa-search ${styles.searchIcon}`} />
            <input
              className={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, slug, category..."
            />
          </div>

          <div className={styles.count}>
            Total: <b>{filteredSorted.length}</b>
          </div>
        </div>
      </div>

      <div className={styles.tableCard}>
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
              {filteredSorted.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div className={styles.titleCell}>
                      <div className={styles.name}>{b.title}</div>
                      <div className={styles.meta}>Slug: {b.slug}</div>
                      <div className={styles.metaSmall}>{b.excerpt}</div>
                    </div>
                  </td>

                  <td>
                    <span className={styles.badge}>{b.category}</span>
                  </td>

                  <td>{formatDate(b.createdAt)}</td>

                  <td className={styles.actionsCol}>
                    <div className={styles.actions}>
                      <Link className={styles.linkBtn} href={`/admin/blogs/${b.id}/edit`}>
                        Edit
                      </Link>

                      <Link
                        className={styles.linkBtn}
                        href={`${PUBLIC_BLOG_BASE}/${b.slug}`}
                        target="_blank"
                      >
                        View
                      </Link>

                      <button
                        type="button"
                        className={styles.dangerBtn}
                        onClick={() => onDelete(b.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!filteredSorted.length ? (
                <tr>
                  <td colSpan={4} className={styles.empty}>
                    No blogs yet. Click <b>+ Add Blog</b> to create one.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className={styles.bottomRow}>
          <Link href={PUBLIC_BLOG_BASE} className={styles.secondaryBtn} target="_blank">
            View Public Blogs Page
          </Link>
        </div>
      </div>
    </main>
  );
}
