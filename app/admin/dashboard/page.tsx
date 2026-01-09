"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./dashboard.module.css";

import { projects as seedProjects } from "../../../data/projects";
import { blogs as seedBlogs } from "../../../data/blogs";

type Project = (typeof seedProjects)[number] & {
  features?: string[];
  gallery?: string[];
};

type Blog = (typeof seedBlogs)[number] & {
  content?: string;
  coverImage?: string;
};

const PROJECTS_KEY = "admin_projects";
const BLOGS_KEY = "admin_blogs";

function getLocalOrSeed<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as T[];
    }
  } catch {}

  // seed localStorage once
  try {
    localStorage.setItem(key, JSON.stringify(seed));
  } catch {}

  return seed;
}

export default function AdminDashboardPage() {
  const router = useRouter();

  // ✅ Protect this page (demo mode)
  useEffect(() => {
    const ok = localStorage.getItem("admin_demo_session") === "true";
    if (!ok) router.replace("/admin/login");
  }, [router]);

  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  function refresh() {
    setProjects(getLocalOrSeed<Project>(PROJECTS_KEY, seedProjects as unknown as Project[]));
    setBlogs(getLocalOrSeed<Blog>(BLOGS_KEY, seedBlogs as unknown as Blog[]));
  }

  useEffect(() => {
    refresh();

    // ✅ update if localStorage changes (another tab)
    const onStorage = (e: StorageEvent) => {
      if (e.key === PROJECTS_KEY || e.key === BLOGS_KEY) refresh();
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const totalBlogs = blogs.length;

    const latestProject = projects
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    const latestBlog = blogs
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    return {
      totalProjects,
      totalBlogs,
      latestProjectTitle: latestProject?.title ?? "—",
      latestBlogTitle: latestBlog?.title ?? "—",
    };
  }, [projects, blogs]);

  function logout() {
    localStorage.removeItem("admin_demo_session");
    router.replace("/admin/login");
  }

  return (
    <main className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.title}>Admin Dashboard</h1>
          <p className={styles.subtitle}>Manage projects and blogs (Owner only)</p>
        </div>

        <div className={styles.topActions}>
          <button type="button" onClick={refresh} className={styles.linkBtn}>
            Refresh
          </button>

          <Link href="/" className={styles.linkBtn}>
            View Website
          </Link>

          <button onClick={logout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      <section className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Projects</h3>
            <span className={styles.badge}>{stats.totalProjects}</span>
          </div>
          <p className={styles.cardText}>
            Latest: <b>{stats.latestProjectTitle}</b>
          </p>

          <div className={styles.cardActions}>
            <Link href="/admin/projects" className={styles.primaryBtn}>
              Manage Projects
            </Link>
            <Link href="/admin/projects/new" className={styles.secondaryBtn}>
              Add New
            </Link>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Blogs</h3>
            <span className={styles.badge}>{stats.totalBlogs}</span>
          </div>
          <p className={styles.cardText}>
            Latest: <b>{stats.latestBlogTitle}</b>
          </p>

          <div className={styles.cardActions}>
            <Link href="/admin/blogs" className={styles.primaryBtn}>
              Manage Blogs
            </Link>
            <Link href="/admin/blogs/new" className={styles.secondaryBtn}>
              Add New
            </Link>
          </div>
        </div>

        <div className={styles.cardWide}>
          <h3>Quick Actions</h3>

          <div className={styles.quickGrid}>
            <Link className={styles.quickItem} href="/admin/projects">
              <div className={styles.quickIcon}>
                <i className="fas fa-building" />
              </div>
              <div>
                <div className={styles.quickTitle}>Projects</div>
                <div className={styles.quickSub}>Edit, delete, publish</div>
              </div>
            </Link>

            <Link className={styles.quickItem} href="/admin/blogs">
              <div className={styles.quickIcon}>
                <i className="fas fa-pen-nib" />
              </div>
              <div>
                <div className={styles.quickTitle}>Blogs</div>
                <div className={styles.quickSub}>Write new posts</div>
              </div>
            </Link>

            <Link className={styles.quickItem} href="/admin/projects/new">
              <div className={styles.quickIcon}>
                <i className="fas fa-plus" />
              </div>
              <div>
                <div className={styles.quickTitle}>New Project</div>
                <div className={styles.quickSub}>Add project details</div>
              </div>
            </Link>

            <Link className={styles.quickItem} href="/admin/blogs/new">
              <div className={styles.quickIcon}>
                <i className="fas fa-plus" />
              </div>
              <div>
                <div className={styles.quickTitle}>New Blog</div>
                <div className={styles.quickSub}>Create blog post</div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
