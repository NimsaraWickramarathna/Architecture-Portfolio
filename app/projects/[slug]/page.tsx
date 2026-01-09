"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import styles from "./project-details.module.css";

import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

import { projects as seedProjects } from "../../../data/projects";

type Project = {
  id: string;
  slug: string;
  category: string;
  title: string;
  desc: string;
  image: string; // cover
  createdAt: string;

  // optional from your admin form
  gallery?: string[];
  features?: string[];
};

const LS_KEY = "admin_projects";

function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as Project[];
    }
  } catch {}

  // fallback to seed
  return seedProjects as unknown as Project[];
}

function formatDate(dateISO: string) {
  const d = new Date(dateISO);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function ProjectDetailsPage() {
  const params = useParams<{ slug: string }>();
  const slug = String(params?.slug || "");

  // gallery viewer
  const [activeImg, setActiveImg] = useState<string>("");

  const project = useMemo(() => {
    const list = loadProjects();
    return list.find((p) => p.slug === slug) || null;
  }, [slug]);

  const gallery = useMemo(() => {
    if (!project) return [];
    const g = (project.gallery && project.gallery.length ? project.gallery : [project.image]).filter(Boolean);
    // remove duplicates
    return Array.from(new Set(g));
  }, [project]);

  useEffect(() => {
    if (project) {
      const g = (project.gallery && project.gallery.length ? project.gallery : [project.image]).filter(Boolean);
      setTimeout(() => {
        setActiveImg(g[0] || project.image);
      }, 0);
    }
  }, [project]);

  if (!project) {
    return (
      <>
        <Header />
        <main className={styles.page}>
          <div className={styles.container}>
            <div className={styles.notFound}>
              <h1>Project not found</h1>
              <p>This project may have been deleted or the link is wrong.</p>
              <Link className={styles.backBtn} href="/projects">
                ← Back to Projects
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className={styles.page}>
        <div className={styles.container}>
          {/* Top */}
          <div className={styles.breadcrumb}>
            <Link href="/projects">Projects</Link>
            <span className={styles.sep}>/</span>
            <span className={styles.current}>{project.title}</span>
          </div>

          <section className={styles.hero}>
            <div className={styles.heroMedia}>
              <img
                src={activeImg || project.image}
                alt={project.title}
                className={styles.heroImg}
                loading="lazy"
              />
            </div>

            <div className={styles.heroInfo}>
              <div className={styles.badge}>{project.category}</div>

              <h1 className={styles.title}>{project.title}</h1>

              <div className={styles.meta}>
                <div className={styles.metaItem}>
                  <i className="fas fa-calendar" />
                  <span>{formatDate(project.createdAt)}</span>
                </div>

                <div className={styles.metaItem}>
                  <i className="fas fa-link" />
                  <span className={styles.slugText}>{project.slug}</span>
                </div>
              </div>

              <p className={styles.desc}>{project.desc}</p>

              {project.features && project.features.length > 0 ? (
                <div className={styles.features}>
                  <h3 className={styles.sectionTitle}>Key Features</h3>
                  <ul className={styles.featureList}>
                    {project.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className={styles.actions}>
                <Link href="/contact" className={styles.primaryBtn}>
                  Start a Similar Project
                </Link>
                <Link href="/projects" className={styles.secondaryBtn}>
                  View All Projects
                </Link>
              </div>
            </div>
          </section>

          {/* Gallery */}
          <section className={styles.gallerySection}>
            <h2 className={styles.sectionTitle}>Gallery</h2>

            <div className={styles.galleryGrid}>
              {gallery.map((img) => (
                <button
                  key={img}
                  type="button"
                  className={`${styles.thumbBtn} ${activeImg === img ? styles.thumbActive : ""}`}
                  onClick={() => setActiveImg(img)}
                  aria-label="View image"
                >
                  <img src={img} alt="Project gallery" className={styles.thumbImg} loading="lazy" />
                </button>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className={styles.cta}>
            <h2>Want to build something like this?</h2>
            <p>
              Tell us about your space, budget, and timeline — we’ll propose a design direction and next steps.
            </p>
            <Link href="/contact" className={styles.primaryBtn}>
              Contact Us
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
