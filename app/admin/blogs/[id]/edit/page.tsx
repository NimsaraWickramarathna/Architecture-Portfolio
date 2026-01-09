"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styles from "./edit-blog.module.css";

import { blogs as seedBlogs } from "../../../../../data/blogs";

type Blog = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  createdAt: string; // YYYY-MM-DD or ISO
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

function normalizeDate(value: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}

type SeedBlog = {
  id: string | number;
  slug?: string;
  category?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  coverImage?: string;
  createdAt?: string | Date;
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
    createdAt: normalizeDate(String(b.createdAt || "")),
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

export default function AdminEditBlogPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const blogId = String(params?.id || "");

  // ✅ protect (demo)
  useEffect(() => {
    const ok = localStorage.getItem("admin_demo_session") === "true";
    if (!ok) router.replace("/admin/login");
  }, [router]);

  const categories = useMemo(() => ["Design", "Sustainability", "Urban Design"], []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [createdAt, setCreatedAt] = useState(new Date().toISOString().slice(0, 10));

  const [image, setImage] = useState<string>("");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  // load blog
  useEffect(() => {
    const list = loadBlogs();
    const found = list.find((b) => String(b.id) === blogId);

    if (!found) {
      router.replace("/admin/blogs");
      return;
    }

    setTitle(found.title);
    setSlug(found.slug);
    setCategory(found.category || categories[0]);
    setExcerpt(found.excerpt);
    setContent(found.content);
    setCreatedAt(normalizeDate(found.createdAt));
    setImage(found.image || "");
    setLoading(false);
  }, [blogId, router, categories]);

  // auto slug if empty
  useEffect(() => {
    if (!title) return;
    setSlug((prev) => (prev ? prev : toSlug(title)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  // cleanup preview
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function ensureUniqueSlug(existing: Blog[], baseSlug: string) {
    let s = baseSlug || "blog";
    let n = 1;
    while (existing.some((b) => b.id !== blogId && b.slug === s)) {
      n += 1;
      s = `${baseSlug}-${n}`;
    }
    return s;
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title is required.");
    if (!category.trim()) return setError("Category is required.");
    if (!excerpt.trim()) return setError("Excerpt is required.");
    if (!content.trim()) return setError("Content is required.");

    const list = loadBlogs();
    const finalSlug = ensureUniqueSlug(list, toSlug(slug || title));

    let finalImage = image || "";
    if (newFile) finalImage = await fileToDataUrl(newFile);

    const updated: Blog = {
      id: blogId,
      title: title.trim(),
      slug: finalSlug,
      category,
      excerpt: excerpt.trim(),
      content: content.trim(),
      createdAt: createdAt || new Date().toISOString().slice(0, 10),
      image: finalImage,
    };

    const updatedList = list.map((b) => (String(b.id) === blogId ? updated : b));
    saveBlogs(updatedList);

    router.push("/admin/blogs");
  }

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.card}>Loading...</div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.title}>Edit Blog</h1>
          <p className={styles.subtitle}>Update your blog post (Owner only).</p>
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

        <form onSubmit={onSave} className={styles.form}>
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
              />
            </label>

            <label className={styles.label}>
              Slug *
              <input
                className={styles.input}
                value={slug}
                onChange={(e) => setSlug(toSlug(e.target.value))}
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
              />
            </label>

            <label className={styles.label} style={{ gridColumn: "1 / -1" }}>
              Content *
              <textarea
                className={styles.textarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
              />
            </label>

            <div style={{ gridColumn: "1 / -1" }}>
              <div className={styles.label}>Cover Image</div>

              <input
                className={styles.input}
                type="file"
                accept="image/*"
                title="Upload cover image"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setNewFile(f);
                  if (preview) URL.revokeObjectURL(preview);
                  setPreview(f ? URL.createObjectURL(f) : "");
                }}
              />

              {(preview || image) ? (
                <div className={styles.previewWrap}>
                  <img className={styles.previewImg} src={preview || image} alt="Cover preview" />
                </div>
              ) : (
                <div className={styles.hint} style={{ marginTop: 8 }}>
                  No cover image set.
                </div>
              )}

              {(preview || image) ? (
                <button
                  type="button"
                  className={styles.removeCoverBtn}
                  onClick={() => {
                    setImage("");
                    setNewFile(null);
                    if (preview) URL.revokeObjectURL(preview);
                    setPreview("");
                  }}
                >
                  Remove Cover
                </button>
              ) : null}
            </div>
          </div>

          <div className={styles.actions}>
            <button className={styles.primaryBtn} type="submit">
              Save Changes
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
