"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import styles from "./edit-project.module.css";

import { projects as seedProjects } from "../../../../../data/projects";

type Project = {
  id: string;
  slug: string;
  category: string;
  title: string;
  desc: string;
  image: string; // cover image (base64 or url)
  gallery: string[]; // all images (base64 or url)
  features: string[];
  createdAt: string; // YYYY-MM-DD
};

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

function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem("admin_projects");
    if (raw) return JSON.parse(raw) as Project[];
  } catch {}

  // fallback seed (and save to LS so edit works consistently)
  const fallback = (seedProjects as Project[]).map((p) => ({
    id: String(p.id),
    slug: p.slug || "",
    category: p.category || "Residential",
    title: p.title || "",
    desc: p.desc || "",
    createdAt: normalizeDate(p.createdAt),
    image: p.image || "",
    gallery: Array.isArray(p.gallery) ? p.gallery : p.image ? [p.image] : [],
    features: Array.isArray(p.features) ? p.features : [],
  })) as Project[];

  try {
    localStorage.setItem("admin_projects", JSON.stringify(fallback));
  } catch {}

  return fallback;
}

function saveProjects(list: Project[]) {
  localStorage.setItem("admin_projects", JSON.stringify(list));
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function AdminEditProjectPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const projectId = String(params?.id || "");

  // protect (demo)
  useEffect(() => {
    const ok = localStorage.getItem("admin_demo_session") === "true";
    if (!ok) router.replace("/admin/login");
  }, [router]);

  const categories = useMemo(() => ["Residential", "Commercial", "Interior"], []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [desc, setDesc] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  // images (base64 strings)
  const [gallery, setGallery] = useState<string[]>([]);
  const [coverIndex, setCoverIndex] = useState<number>(0);

  // features
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  // load project
  useEffect(() => {
    if (!projectId) return;

    const list = loadProjects();
    const p = list.find((x) => String(x.id) === projectId);

    if (!p) {
      router.replace("/admin/projects");
      return;
    }

    setTitle(p.title || "");
    setSlug(p.slug || "");
    setCategory(p.category || categories[0]);
    setDesc(p.desc || "");
    setCreatedAt(normalizeDate(p.createdAt));

    const g = Array.isArray(p.gallery) && p.gallery.length ? p.gallery : p.image ? [p.image] : [];
    setGallery(g);

    // cover index based on p.image if found
    let idx = 0;
    if (p.image && g.length) {
      const found = g.findIndex((x) => x === p.image);
      idx = found >= 0 ? found : 0;
    }
    setCoverIndex(idx);

    setFeatures(Array.isArray(p.features) ? p.features : []);

    setLoading(false);
  }, [projectId, router, categories]);

  // auto slug from title if slug empty
  useEffect(() => {
    if (!title) return;
    setSlug((prev) => (prev ? prev : toSlug(title)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  function ensureUniqueSlug(existing: Project[], baseSlug: string) {
    let s = baseSlug || "project";
    let n = 1;

    while (existing.some((p) => p.id !== projectId && p.slug === s)) {
      n += 1;
      s = `${baseSlug}-${n}`;
    }
    return s;
  }

  async function addImages(files: FileList | null) {
    if (!files || files.length === 0) return;

    const onlyImages = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!onlyImages.length) return;

    const dataUrls = await Promise.all(onlyImages.map((f) => fileToDataUrl(f)));
    setGallery((prev) => [...prev, ...dataUrls]);
  }

  function removeImage(index: number) {
    setGallery((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      setCoverIndex((ci) => {
        if (updated.length === 0) return 0;
        if (index === ci) return 0; // removed cover => new first is cover
        if (index < ci) return ci - 1; // shift
        return ci;
      });

      return updated;
    });
  }

  function addFeature() {
    const clean = featureInput.trim();
    if (!clean) return;

    setFeatures((prev) => {
      const exists = prev.some((f) => f.toLowerCase() === clean.toLowerCase());
      if (exists) return prev;
      return [...prev, clean];
    });
    setFeatureInput("");
  }

  function removeFeature(text: string) {
    setFeatures((prev) => prev.filter((f) => f !== text));
  }

  function onSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title is required.");
    if (!category.trim()) return setError("Category is required.");
    if (!desc.trim()) return setError("Description is required.");
    if (!createdAt.trim()) return setError("Created date is required.");
    if (!gallery.length) return setError("Please keep at least 1 image in the gallery.");

    const list = loadProjects();

    const base = toSlug(slug || title);
    const finalSlug = ensureUniqueSlug(list, base);

    const safeCoverIndex = Math.min(Math.max(0, coverIndex), gallery.length - 1);
    const cover = gallery[safeCoverIndex] || gallery[0];

    const updatedProject: Project = {
      id: projectId,
      title: title.trim(),
      slug: finalSlug,
      category,
      desc: desc.trim(),
      createdAt,
      features,
      gallery,
      image: cover,
    };

    const updatedList = list.map((p) => (String(p.id) === projectId ? updatedProject : p));
    saveProjects(updatedList);

    router.push("/admin/projects");
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
          <h1 className={styles.title}>Edit Project</h1>
          <p className={styles.subtitle}>Update photos, cover, features and details.</p>
        </div>

        <div className={styles.topActions}>
          <Link href="/admin/projects" className={styles.secondaryBtn}>
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
                placeholder="Modern Hillside Residence"
              />
            </label>

            <label className={styles.label}>
              Slug *
              <input
                className={styles.input}
                value={slug}
                onChange={(e) => setSlug(toSlug(e.target.value))}
                placeholder="modern-hillside-residence"
              />
              <span className={styles.hint}>URL: /projects/{slug || "your-slug"}</span>
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
              Created Date *
              <input
                className={styles.input}
                type="date"
                value={createdAt}
                onChange={(e) => setCreatedAt(e.target.value)}
              />
            </label>

            <label className={styles.label} style={{ gridColumn: "1 / -1" }}>
              Short Description *
              <textarea
                className={styles.textarea}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Write a short description about this project..."
                rows={5}
              />
            </label>

            {/* Images */}
            <div style={{ gridColumn: "1 / -1" }}>
              <div className={styles.label}>Project Photos * (multiple)</div>

              <input
                className={styles.input}
                type="file"
                accept="image/*"
                multiple
                placeholder="Choose images"
                onChange={(e) => {
                  addImages(e.target.files);
                  e.currentTarget.value = "";
                }}
                aria-label="Upload project photos"
              />

              <div className={styles.hint} style={{ marginTop: 6 }}>
                Select a <b>Cover</b>. You can remove photos too.
              </div>

              {gallery.length > 0 ? (
                <div className={styles.imagesGrid}>
                  {gallery.map((src, idx) => (
                    <div key={`${idx}-${src.slice(0, 20)}`} className={styles.imgCard}>
                      <img className={styles.img} src={src} alt={`Project image ${idx + 1}`} />

                      <label className={styles.coverRow}>
                        <input
                          type="radio"
                          name="cover"
                          checked={coverIndex === idx}
                          onChange={() => setCoverIndex(idx)}
                        />
                        <span>Cover</span>
                      </label>

                      {coverIndex === idx ? <div className={styles.coverBadge}>Cover</div> : null}

                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => removeImage(idx)}
                        aria-label="Remove image"
                      >
                        ✕
                      </button>

                      <div className={styles.fileName}>Image {idx + 1}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Features */}
            <div style={{ gridColumn: "1 / -1" }}>
              <div className={styles.label}>Features (optional)</div>

              <div className={styles.featureRow}>
                <input
                  className={styles.input}
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  placeholder="e.g., Sustainable Materials"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                />
                <button type="button" className={styles.smallBtn} onClick={addFeature}>
                  + Add
                </button>
              </div>

              {features.length > 0 ? (
                <div className={styles.featuresWrap}>
                  {features.map((f) => (
                    <div key={f} className={styles.featureChip}>
                      <span>{f}</span>
                      <button
                        type="button"
                        className={styles.chipRemove}
                        onClick={() => removeFeature(f)}
                        aria-label="Remove feature"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.hint} style={{ marginTop: 8 }}>
                  Add highlights like: Smart Home, Passive Cooling, Rainwater Harvesting…
                </div>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.primaryBtn}>
              Save Changes
            </button>

            <Link href="/admin/projects" className={styles.secondaryBtn}>
              Cancel
            </Link>

            <Link href={`/projects/${slug}`} className={styles.secondaryBtn} target="_blank">
              View Public Page
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
