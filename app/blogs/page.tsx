"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./blogs.module.css";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BlogCard from "../../components/BlogCard";
import ScrollAnimations from "../../components/ScrollAnimations";

import { blogs as seedBlogs } from "../../data/blogs";

type Blog = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  createdAt: string;
  image?: string;
  content?: string;
};

type SeedBlog = {
  id: string | number;
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

function formatDate(dateISO: string) {
  const d = new Date(dateISO);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function normalizeSeed(seed: SeedBlog[]): Blog[] {
  const today = new Date().toISOString().slice(0, 10);
  return seed.map((b) => ({
    id: String(b.id),
    slug: b.slug || "",
    category: b.category || "Design",
    title: b.title || "",
    excerpt: b.excerpt || "",
    createdAt: b.createdAt ? String(b.createdAt).slice(0, 10) : today,
    image: b.image || b.coverImage || "",
    content: b.content || "",
  }));
}

function loadBlogs(): Blog[] {
  // 1) localStorage first
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Blog[];
    }
  } catch {}

  // 2) fallback seed
  const seeded = normalizeSeed(seedBlogs as unknown as SeedBlog[]);
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(seeded));
  } catch {}

  return seeded;
}

export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);

  // ✅ Load latest blogs (localStorage) on mount + when tab focus
  useEffect(() => {
    const refresh = () => setAllBlogs(loadBlogs());

    refresh();

    // other tab updates
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_KEY) refresh();
    };

    // same tab: when user returns to this tab
    const onFocus = () => refresh();
    const onVisibility = () => {
      if (document.visibilityState === "visible") refresh();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    allBlogs.forEach((b) => set.add(b.category));
    return ["all", ...Array.from(set)];
  }, [allBlogs]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    return allBlogs
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .filter((b) => (activeCategory === "all" ? true : b.category === activeCategory))
      .filter((b) => {
        if (!q) return true;
        return (
          b.title.toLowerCase().includes(q) ||
          (b.excerpt || "").toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
        );
      });
  }, [allBlogs, activeCategory, query]);

  return (
    <>
      <Header />
      <ScrollAnimations />

      <main className={styles.blogsPage}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroContent}>
              <h1>Blog &amp; Insights</h1>
              <p>
                Architecture, interior design, sustainability, and materials — practical insights and ideas
                from our studio.
              </p>
            </div>
          </div>
        </section>

        {/* Controls */}
        <section className={styles.controls}>
          <div className="container">
            <div className={styles.controlsRow}>
              <div className={styles.searchBox}>
                <i className={`fas fa-search ${styles.searchIcon}`} />
                <input
                  className={styles.searchInput}
                  placeholder="Search posts..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className={styles.filters}>
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`${styles.filterBtn} ${activeCategory === c ? styles.filterActive : ""}`}
                    onClick={() => setActiveCategory(c)}
                  >
                    {c === "all" ? "All" : c}
                  </button>
                ))}
              </div>

              <div className={styles.count}>
                Showing <b>{visible.length}</b> posts
              </div>
            </div>
          </div>
        </section>

        {/* Grid */}
        <section className="section">
          <div className="container">
            <div className={styles.grid}>
              {visible.map((b, idx) => (
                <BlogCard
                  key={b.id}
                  id={`blogCard${idx + 1}`}
                  category={b.category}
                  date={formatDate(b.createdAt)}
                  title={b.title}
                  excerpt={b.excerpt}
                  image={
                    b.image ||
                    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1200&q=80"
                  }
                  href={`/blogs/${b.slug}`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
