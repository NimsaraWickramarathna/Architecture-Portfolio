import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionTitle from "@/components/SectionTittle";
import styles from "./about.module.css";

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className={styles.aboutPage}>
        {/* Hero */}
        <section className={styles.aboutHero}>
          <div className="container">
            <div className={styles.heroContent}>
              <h1>Design Philosophy &amp; Professional Journey</h1>
              <p>
                12+ years dedicated to creating sustainable, human-centered architecture. Award-winning
                architect specializing in residential and commercial spaces that balance innovation with
                timeless aesthetics.
              </p>
            </div>
          </div>
        </section>

        {/* Profile */}
        <section className={styles.section}>
          <div className="container">
            <SectionTitle title="The Architect" desc="" />

            <div className={styles.profileGrid}>
              <div className={styles.profileImage}>
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                  alt="Principal Architect"
                  loading="lazy"
                />
              </div>

              <div>
                <div className={styles.profileHeader}>
                  <h1 style={{ fontSize: "2.5rem" }}>Alexandra Morgan</h1>
                  <span className={styles.profileRole}>Principal Architect</span>
                </div>

                <p>
                  With over a decade of experience, I specialize in sustainable architecture that harmonizes
                  form, function, and environment. My approach combines technical expertise with creative
                  vision to deliver spaces that inspire and endure.
                </p>

                <p>
                  I hold a Master of Architecture from Cornell University and certifications in Passive House
                  Design and LEED. My work has been featured in Architectural Digest, Dwell, and received
                  multiple design awards.
                </p>

                <div className={styles.contactCard}>
                  <h4 style={{ marginBottom: "0.75rem", color: "var(--text-charcoal)" }}>
                    Contact Information
                  </h4>

                  <div className={styles.contactInfoGrid}>
                    <div className={styles.contactRow}>
                      <i className="fas fa-envelope" />
                      <span>alex@creatorarchitecture.com</span>
                    </div>

                    <div className={styles.contactRow}>
                      <i className="fas fa-phone" />
                      <span>+1 (555) 123-4567</span>
                    </div>

                    <div className={styles.contactRow}>
                      <i className="fas fa-map-marker-alt" />
                      <span>New York, NY</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy cards */}
        <section className={styles.section}>
          <div className="container">
            <SectionTitle title="Design Philosophy" desc="Core principles guiding every project" />

            <div className={styles.cardsGrid}>
              <article className={styles.aboutCard}>
                <div className={styles.cardIcon}>
                  <i className="fas fa-leaf" />
                </div>
                <h3>Sustainability First</h3>
                <p>
                  Every design prioritizes environmental responsibility through energy efficiency, sustainable
                  materials, and passive design strategies.
                </p>
              </article>

              <article className={styles.aboutCard}>
                <div className={styles.cardIcon}>
                  <i className="fas fa-home" />
                </div>
                <h3>Human-Centered</h3>
                <p>
                  Spaces are designed around human experience, emphasizing natural light, intuitive flow, and
                  emotional connection.
                </p>
              </article>

              <article className={styles.aboutCard}>
                <div className={styles.cardIcon}>
                  <i className="fas fa-lightbulb" />
                </div>
                <h3>Timeless Innovation</h3>
                <p>
                  Blending contemporary technology with enduring design principles to create spaces that remain
                  relevant for generations.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className={styles.section}>
          <div className="container">
            <SectionTitle title="Career Journey" desc="Professional milestones and achievements" />

            <div className={styles.timeline}>
              <article className={styles.timelineItem}>
                <div className={styles.timelineYear}>2012</div>
                <div className={styles.timelineDot} />
                <div className={styles.timelineContent}>
                  <h3>M.Arch Graduation</h3>
                  <p>Graduated with honors. Began career at a leading international firm.</p>
                </div>
              </article>

              <article className={styles.timelineItem}>
                <div className={styles.timelineYear}>2015</div>
                <div className={styles.timelineDot} />
                <div className={styles.timelineContent}>
                  <h3>First Award</h3>
                  <p>Won Emerging Architect Award, establishing a strong design signature.</p>
                </div>
              </article>

              <article className={styles.timelineItem}>
                <div className={styles.timelineYear}>2018</div>
                <div className={styles.timelineDot} />
                <div className={styles.timelineContent}>
                  <h3>Practice Launch</h3>
                  <p>Founded Creator Architecture focusing on sustainable, modern design.</p>
                </div>
              </article>

              <article className={styles.timelineItem}>
                <div className={styles.timelineYear}>2022</div>
                <div className={styles.timelineDot} />
                <div className={styles.timelineContent}>
                  <h3>International Recognition</h3>
                  <p>Received International Sustainable Design Award for a landmark project.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaBox}>
              <h2>Start Your Project</h2>
              <p>Ready to transform your space? Let’s collaborate on creating something extraordinary.</p>

              <div className={styles.ctaButtons}>
                <Link href="/contact" className="btn-primary">
                  Book Consultation
                </Link>
                <Link href="/projects" className="btn-secondary">
                  View Portfolio
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
