"use client";

import { useMemo, useState } from "react";
import styles from "./blogs.module.css";

// ✅ IMPORTANT: correct paths from app/blogs/page.tsx
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BlogCard from "../../components/BlogCard";
import { blogs as allBlogs } from "../../data/blogs";
import ScrollAnimations from "../../components/ScrollAnimations";


function formatDate(dateISO: string) {
  const d = new Date(dateISO);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => {
    const set = new Set<string>();
    allBlogs.forEach((b) => set.add(b.category));
    return ["all", ...Array.from(set)];
  }, []);

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
          b.excerpt.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
        );
      });
  }, [activeCategory, query]);

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
                  image={b.image}
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
