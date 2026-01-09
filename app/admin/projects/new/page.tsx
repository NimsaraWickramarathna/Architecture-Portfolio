"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./new-project.module.css";

import { projects as seedProjects } from "../../../../data/projects";

type Project = {
  id: string;
  slug: string;
  category: string;
  title: string;
  desc: string;
  image: string; // cover image (base64)
  gallery: string[]; // all images (base64)
  features: string[]; // new
  createdAt: string;
};

type LocalImage = {
  id: string;
  file: File;
  previewUrl: string; // object URL (for preview only)
};

function toSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem("admin_projects");
    if (raw) return JSON.parse(raw) as Project[];
  } catch {}
  return seedProjects as unknown as Project[];
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

export default function AdminNewProjectPage() {
  const router = useRouter();

  // ✅ protect (demo)
  useEffect(() => {
    const ok = localStorage.getItem("admin_demo_session") === "true";
    if (!ok) router.replace("/admin/login");
  }, [router]);

  const categories = useMemo(() => ["Residential", "Commercial", "Interior"], []);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [desc, setDesc] = useState("");
  const [createdAt, setCreatedAt] = useState(() => new Date().toISOString().slice(0, 10));

  // ✅ Images
  const [images, setImages] = useState<LocalImage[]>([]);
  const [coverId, setCoverId] = useState<string>("");

  // ✅ Features
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  const [error, setError] = useState("");

  // auto slug from title (if slug empty)
  useEffect(() => {
    if (!title) return;
    setSlug((prev) => (prev ? prev : toSlug(title)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  // cleanup previews on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function ensureUniqueSlug(existing: Project[], baseSlug: string) {
    let s = baseSlug || "project";
    let n = 1;
    while (existing.some((p) => p.slug === s)) {
      n += 1;
      s = `${baseSlug}-${n}`;
    }
    return s;
  }

  function addImages(files: FileList | null) {
    if (!files || files.length === 0) return;

    const onlyImages = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!onlyImages.length) return;

    const newOnes: LocalImage[] = onlyImages.map((file) => ({
      id: `img_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prev) => {
      const merged = [...prev, ...newOnes];
      // if cover not selected yet, set first image as cover
      if (!coverId && merged.length > 0) setCoverId(merged[0].id);
      return merged;
    });
  }

  function removeImage(id: string) {
    setImages((prev) => {
      const target = prev.find((x) => x.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);

      const updated = prev.filter((x) => x.id !== id);
      // if removed cover, set new cover
      if (coverId === id) setCoverId(updated[0]?.id || "");
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title is required.");
    if (!category.trim()) return setError("Category is required.");
    if (!desc.trim()) return setError("Description is required.");
    if (!createdAt.trim()) return setError("Created date is required.");
    if (images.length === 0) return setError("Please upload at least 1 image.");
    if (!coverId) return setError("Please select a cover image.");

    const list = loadProjects();

    const base = toSlug(slug || title);
    const finalSlug = ensureUniqueSlug(list, base);

    // convert to base64 for demo storage
    const dataUrls = await Promise.all(images.map((img) => fileToDataUrl(img.file)));
    const coverIndex = images.findIndex((img) => img.id === coverId);
    const coverDataUrl = dataUrls[Math.max(0, coverIndex)];

    const newProject: Project = {
      id: `p_${Date.now()}`,
      title: title.trim(),
      slug: finalSlug,
      category,
      desc: desc.trim(),
      createdAt,
      features,
      image: coverDataUrl,
      gallery: dataUrls,
    };

    saveProjects([newProject, ...list]);
    router.push("/admin/projects");
  }

  return (
    <main className={styles.page}>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.title}>Add New Project</h1>
          <p className={styles.subtitle}>Upload multiple photos, choose a cover, and add features</p>
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

            {/* ✅ Images */}
            <div style={{ gridColumn: "1 / -1" }}>
              <div className={styles.label}>Project Photos * (multiple)</div>

              <input
                className={styles.input}
                type="file"
                accept="image/*"
                multiple
                placeholder="Choose project photos"
                onChange={(e) => {
                  addImages(e.target.files);
                  e.currentTarget.value = "";
                }}
              />

              <div className={styles.hint} style={{ marginTop: 6 }}>
                Upload multiple images. Select one as <b>Cover</b>.
              </div>

              {images.length > 0 ? (
                <div className={styles.imagesGrid}>
                  {images.map((img) => (
                    <div key={img.id} className={styles.imgCard}>
                      <img className={styles.img} src={img.previewUrl} alt={img.file.name} />

                      <label className={styles.coverRow}>
                        <input
                          type="radio"
                          name="cover"
                          checked={coverId === img.id}
                          onChange={() => setCoverId(img.id)}
                        />
                        <span>Cover</span>
                      </label>

                      {coverId === img.id ? <div className={styles.coverBadge}>Cover</div> : null}

                      <button
                        type="button"
                        className={styles.removeBtn}
                        onClick={() => removeImage(img.id)}
                        aria-label="Remove image"
                      >
                        ✕
                      </button>

                      <div className={styles.fileName} title={img.file.name}>
                        {img.file.name}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* ✅ Features */}
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
                  Add small highlights like: Smart Home, Passive Cooling, Rainwater Harvesting…
                </div>
              )}
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.primaryBtn}>
              Save Project
            </button>
            <Link href="/admin/projects" className={styles.secondaryBtn}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
