"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "./projects.module.css";

type Project = {
  id: string;
  slug: string;
  category: "residential" | "commercial" | "interior";
  categoryLabel: string;
  title: string;
  year: string;
  location: string;
  description: string;
  image: string;
};

function toSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProjectsClient() {
  // Converted from your projects.html cards
  const projects: Project[] = useMemo(
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
          "A sustainable family home designed to maximize views while mini...impact. Features passive solar design and rainwater harvesting.",
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
          "A collaborative workspace designed for a leadi...stations, green walls, and advanced energy management systems.",
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
          "A complete interior transformation of a historic ... creating a warm and inviting atmosphere.",
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
          "A vacation home nestled in nature, featuring large ... sustainable building materials and smart home technology.",
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
          "A 25-story office building achieving LEED Plat...een roofs, solar panels, and advanced water recycling systems.",
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
          "Complete interior redesign focusing on clean l...lexible living spaces to accommodate changing lifestyle needs.",
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

  const [active, setActive] = useState<(typeof filters)[number]["key"]>("all");

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
  }, [active]);

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
              Each of these projects began with a vision and collaboration. ... let&apos;s discuss how we can
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
