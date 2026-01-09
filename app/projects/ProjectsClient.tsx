"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./projects.module.css";

type CategoryKey = "residential" | "commercial" | "interior" | "all";

type ProjectCard = {
  id: string;
  slug: string;
  category: Exclude<CategoryKey, "all">;
  categoryLabel: string;
  title: string;
  year: string;
  location: string;
  description: string;
  image: string;
};

type AdminProject = {
  id: string;
  slug: string;
  category: string; // "Residential" | "Commercial" | "Interior" (your admin)
  title: string;
  desc?: string;
  description?: string;
  createdAt: string; // YYYY-MM-DD or ISO
  image?: string; // cover (base64)
  gallery?: string[];
  features?: string[];

  // optional future fields
  year?: string;
  location?: string;
};

const LS_KEY = "admin_projects";

function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function safeYear(createdAt?: string) {
  if (!createdAt) return "";
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return "";
  return String(d.getFullYear());
}

function categoryToKey(cat: string): Exclude<CategoryKey, "all"> {
  const c = (cat || "").toLowerCase();
  if (c.includes("res")) return "residential";
  if (c.includes("com")) return "commercial";
  if (c.includes("inter")) return "interior";
  // default
  return "residential";
}

function categoryLabelFromKey(key: Exclude<CategoryKey, "all">) {
  if (key === "residential") return "Residential";
  if (key === "commercial") return "Commercial";
  return "Interior Design";
}

function mapAdminToCard(p: AdminProject): ProjectCard {
  const key = categoryToKey(p.category);
  const label = p.category ? p.category : categoryLabelFromKey(key);

  const cover = p.image || p.gallery?.[0] || "";
  const year = p.year || safeYear(p.createdAt) || "—";
  const location = p.location || "—";

  return {
    id: String(p.id),
    slug: p.slug || toSlug(p.title || "project"),
    category: key,
    categoryLabel: label,
    title: p.title || "Untitled Project",
    year,
    location,
    description: (p.desc || p.description || "").trim(),
    image: cover,
  };
}

function loadAdminProjects(): AdminProject[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AdminProject[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function ProjectsClient() {
  // ✅ your current hardcoded projects -> fallback only
  const fallbackProjects: ProjectCard[] = useMemo(
    () => [
      {
        id: "1",
        slug: toSlug("Modern Hillside Residence"),
        category: "residential",
        categoryLabel: "Residential",
        title: "Modern Hillside Residence",
        year: "2023",
        location: "San Francisco, CA",
        description:
          "A sustainable family home designed to maximize views while minimizing environmental impact. Features passive solar design and rainwater harvesting.",
        image:
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "2",
        slug: toSlug("Tech Innovation Hub"),
        category: "commercial",
        categoryLabel: "Commercial",
        title: "Tech Innovation Hub",
        year: "2022",
        location: "Austin, TX",
        description:
          "A collaborative workspace designed for a leading tech company featuring modular workstations, green walls, and advanced energy management systems.",
        image:
          "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "3",
        slug: toSlug("Urban Loft Renovation"),
        category: "interior",
        categoryLabel: "Interior Design",
        title: "Urban Loft Renovation",
        year: "2023",
        location: "New York, NY",
        description:
          "A complete interior transformation of a historic loft blending exposed brick, warm lighting, and custom-built furniture for a modern lifestyle.",
        image:
          "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "4",
        slug: toSlug("Lakeside Retreat"),
        category: "residential",
        categoryLabel: "Residential",
        title: "Lakeside Retreat",
        year: "2022",
        location: "Lake Tahoe, CA",
        description:
          "A vacation home nestled in nature, featuring large glass openings, sustainable materials, and smart home technology for comfort.",
        image:
          "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "5",
        slug: toSlug("Sustainable Office Tower"),
        category: "commercial",
        categoryLabel: "Commercial",
        title: "Sustainable Office Tower",
        year: "2021",
        location: "Seattle, WA",
        description:
          "A 25-story office building targeting LEED Platinum with green roofs, solar panels, and advanced water recycling systems.",
        image:
          "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "6",
        slug: toSlug("Minimalist Apartment"),
        category: "interior",
        categoryLabel: "Interior Design",
        title: "Minimalist Apartment",
        year: "2023",
        location: "Portland, OR",
        description:
          "Complete interior redesign focusing on clean lines, natural textures, and flexible living spaces to suit changing needs.",
        image:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      },
    ],
    []
  );

  const filters = useMemo(
    () => [
      { key: "all" as const, label: "All Projects" },
      { key: "residential" as const, label: "Residential" },
      { key: "commercial" as const, label: "Commercial" },
      { key: "interior" as const, label: "Interior Design" },
    ],
    []
  );

  const [active, setActive] = useState<CategoryKey>("all");
  const [storageVersion, setStorageVersion] = useState(0);

  const projects = useMemo(() => {
    const admin = loadAdminProjects();
    return admin.length ? admin.map(mapAdminToCard) : fallbackProjects;
  }, [fallbackProjects, storageVersion]);

  // ✅ Listen for changes (if admin updates in another tab)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== LS_KEY) return;
      setStorageVersion((v) => v + 1);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const visible = useMemo(() => {
    if (active === "all") return projects;
    return projects.filter((p) => p.category === active);
  }, [active, projects]);

  // Animate cards on scroll (adds "animate" class like your home page)
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-animate]")) as HTMLElement[];
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("animate");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [active, visible.length]);

  return (
    <main className={styles.projectsPage}>
      {/* Filters */}
      <section className={styles.filterSection}>
        <div className="container">
          <div className={styles.filterWrap}>
            <div className={styles.filterButtons}>
              {filters.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`${styles.filterBtn} ${active === f.key ? styles.filterBtnActive : ""}`}
                  onClick={() => setActive(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className={styles.countText}>
              Showing <b>{visible.length}</b> of <b>{projects.length}</b> projects
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section">
        <div className="container">
          <div className={styles.projectsGrid}>
            {visible.map((p) => (
              <article key={p.id} className="project-card" data-animate>
                <div className="project-image">
                  <img src={p.image} alt={p.title} loading="lazy" width={800} height={600} />
                  <span className="project-category">{p.categoryLabel}</span>
                </div>

                <div className="project-content">
                  <h3 className="project-title">{p.title}</h3>

                  <div className="project-meta">
                    <div className="project-meta-item">
                      <i className="fas fa-calendar" />
                      <span>{p.year}</span>
                    </div>
                    <div className="project-meta-item">
                      <i className="fas fa-map-marker-alt" />
                      <span>{p.location}</span>
                    </div>
                  </div>

                  <p className="project-description">{p.description}</p>

                  <Link href={`/projects/${p.slug}`} className="project-link">
                    View Project <i className="fas fa-arrow-right" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="container">
          <div className={styles.ctaSection}>
            <h2>Ready to Start Your Project?</h2>
            <p>
              Each of these projects began with a vision and collaboration. Let&apos;s discuss how we can
              bring your architectural dreams to life.
            </p>

            <div className={styles.ctaButtons}>
              <Link href="/contact" className="btn-primary">
                Schedule Consultation
              </Link>
              <Link href="/about" className="btn-secondary">
                Learn About Our Process
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
