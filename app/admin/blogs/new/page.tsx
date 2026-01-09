"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./new-blog.module.css";

import { blogs as seedBlogs } from "../../../../data/blogs";

type Blog = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  image: string; // cover (base64 or url)
  createdAt: string; // YYYY-MM-DD
};

const LS_KEY = "admin_blogs";

function toSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type SeedBlog = {
  id?: string | number;
  slug?: string;
  category?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  coverImage?: string;
  createdAt?: string | number;
};

function normalizeSeed(seed: SeedBlog[]): Blog[] {
  return seed.map((b) => ({
    id: String(b.id),
    slug: b.slug || "",
    category: b.category || "Design",
    title: b.title || "",
    excerpt: b.excerpt || "",
    content: b.content || "",
    image: b.image || b.coverImage || "",
    createdAt: (b.createdAt && String(b.createdAt)) || new Date().toISOString().slice(0, 10),
  }));
}

function loadBlogs(): Blog[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Blog[];
    }
  } catch {}

  const seeded = normalizeSeed(seedBlogs as unknown as SeedBlog[]);
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(seeded));
  } catch {}

  return seeded;
}

function saveBlogs(list: Blog[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function AdminNewBlogPage() {
  const router = useRouter();

  // ✅ protect (demo)
  useEffect(() => {
    const ok = localStorage.getItem("admin_demo_session") === "true";
    if (!ok) router.replace("/admin/login");
  }, [router]);

  const categories = useMemo(() => ["Design", "Sustainability", "Urban Design"], []);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [createdAt, setCreatedAt] = useState(() => new Date().toISOString().slice(0, 10));

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");

  const [error, setError] = useState("");

  // auto slug if empty
  useEffect(() => {
    if (!title) return;
    setSlug((prev) => (prev ? prev : toSlug(title)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  // cleanup preview
  useEffect(() => {
    return () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [coverPreview]);

  function ensureUniqueSlug(existing: Blog[], baseSlug: string) {
    let s = baseSlug || "blog";
    let n = 1;
    while (existing.some((b) => b.slug === s)) {
      n += 1;
      s = `${baseSlug}-${n}`;
    }
    return s;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title is required.");
    if (!category.trim()) return setError("Category is required.");
    if (!excerpt.trim()) return setError("Excerpt is required.");
    if (!content.trim()) return setError("Content is required.");

    const list = loadBlogs();
    const finalSlug = ensureUniqueSlug(list, toSlug(slug || title));

    let image = "";
    if (coverFile) image = await fileToDataUrl(coverFile);

    const newBlog: Blog = {
      id: `b_${Date.now()}`,
      title: title.trim(),
      slug: finalSlug,
      category,
      excerpt: excerpt.trim(),
      content: content.trim(),
      createdAt: createdAt || new Date().toISOString().slice(0, 10),
      image,
    };

    saveBlogs([newBlog, ...list]);
    router.push("/admin/blogs");
  }

  return (
    <main className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.title}>Add New Blog</h1>
          <p className={styles.subtitle}>Create a new blog post (Owner only).</p>
        </div>

        <div className={styles.topActions}>
          <Link href="/admin/blogs" className={styles.secondaryBtn}>
            ← Back
          </Link>
          <Link href="/admin/dashboard" className={styles.secondaryBtn}>
            Dashboard
          </Link>
        </div>
      </div>

      <div className={styles.card}>
        {error ? <div className={styles.error}>{error}</div> : null}

        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.grid}>
            <label className={styles.label}>
              Title *
              <input
                className={styles.input}
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSlug("");
                }}
                placeholder="The Future of Sustainable Architecture"
              />
            </label>

            <label className={styles.label}>
              Slug *
              <input
                className={styles.input}
                value={slug}
                onChange={(e) => setSlug(toSlug(e.target.value))}
                placeholder="future-of-sustainable-architecture"
              />
              <span className={styles.hint}>URL: /blogs/{slug || "your-slug"}</span>
            </label>

            <label className={styles.label}>
              Category *
              <select
                className={styles.input}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.label}>
              Created Date
              <input
                className={styles.input}
                type="date"
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
              />
            </label>

            <label className={styles.label} style={{ gridColumn: "1 / -1" }}>
              Excerpt *
              <textarea
                className={styles.textarea}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="Short summary shown on blog cards..."
              />
            </label>

            <label className={styles.label} style={{ gridColumn: "1 / -1" }}>
              Content *
              <textarea
                className={styles.textarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                placeholder="Write the full blog content here..."
              />
            </label>

            <div style={{ gridColumn: "1 / -1" }}>
              <div className={styles.label}>Cover Image (optional)</div>

              <input
                className={styles.input}
                type="file"
                accept="image/*"
                placeholder="Choose a cover image"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setCoverFile(f);

                  if (coverPreview) URL.revokeObjectURL(coverPreview);
                  setCoverPreview(f ? URL.createObjectURL(f) : "");
                }}
              />

              {coverPreview ? (
                <div className={styles.previewWrap}>
                  <img className={styles.previewImg} src={coverPreview} alt="Cover preview" />
                </div>
              ) : (
                <div className={styles.hint} style={{ marginTop: 8 }}>
                  Upload a cover image for better look on the blog list page.
                </div>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.primaryBtn} type="submit">
              Save Blog
            </button>
            <Link href="/admin/blogs" className={styles.secondaryBtn}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
