import Header from "../components/Header";
import HeroSlider from "../components/HeroSlider";
import SectionTitle from "../components/SectionTittle";
import ProjectCard from "../components/ProjectCard";
import BlogCard from "../components/BlogCard";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import SmoothScroll from "../components/SmoothScroll";
import ScrollAnimations from "../components/ScrollAnimations";
import Link from "next/link";

import { projects } from "../data/projects";

export default function HomePage() {
  const latestProjects = projects
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  return (
    <>
      <Header />

      {/* JS behaviors */}
      <SmoothScroll />
      <ScrollAnimations />

      {/* Hero */}
      <section className="hero" id="home">
        <HeroSlider />

        <div className="container">
          <div className="hero-content">
            <h1>Discover Our Journey to Architectural Excellence</h1>
            <p>
              For over a decade, we have been pushing the boundaries of architectural design, creating
              spaces that inspire and endure. Our commitment to innovation, sustainability and client
              satisfaction has established us as leaders in modern architecture and interior design.
            </p>

            <div className="stats">
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Project Success Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">12+</div>
                <div className="stat-label">Years of Experience</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about section section-white" id="about">
        <div className="container">
          <SectionTitle
            title="About Our Studio"
            desc="Learn more about our philosophy, approach, and the team behind our success."
          />

          <div className="about-content">
            <div className="about-text" id="aboutText">
              <h3>Our Design Philosophy</h3>
              <p>
                We believe that architecture should not only serve functional needs but also inspire and
                elevate the human experience. Our designs blend form and function, creating spaces that
                are both beautiful and practical.
              </p>
              <p>
                Sustainability is at the core of our practice. We incorporate eco-friendly materials and
                energy-efficient solutions in all our projects, ensuring minimal environmental impact
                while maximizing comfort and efficiency.
              </p>
              <Link href="/about" className="btn-primary">
                Learn More About Us
              </Link>
            </div>

            <div className="about-image" id="aboutImage">
              <img
                src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Modern Architecture"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects (LATEST 4) */}
      <section className="projects-preview section section-light" id="projects">
        <div className="container">
          <SectionTitle
            title="Featured Projects"
            desc="Explore our diverse portfolio of architectural masterpieces that showcase innovation, sustainability, and exceptional design."
          />

          <div className="projects-grid">
            {latestProjects.map((p, idx) => (
              <ProjectCard
                key={p.id}
                id={`projectCard${idx + 1}`}
                category={p.category}
                title={p.title}
                desc={p.desc}
                image={p.image}
                href={`/projects/${p.slug}`}
              />
            ))}
          </div>

          <div className="text-center">
            <Link href="/projects" className="btn-secondary">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="blog section section-white" id="blog">
        <div className="container">
          <SectionTitle
            title="Latest Blog Posts"
            desc="Stay updated with the latest trends, insights, and news in architecture and design."
          />

          <div className="blog-grid">
            <BlogCard
              id="blogCard1"
              category="Sustainability"
              date="December 15, 2024"
              title="The Future of Sustainable Architecture"
              excerpt="Exploring innovative materials and design strategies that minimize environmental impact while maximizing aesthetic appeal and functionality."
              image="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            />
            <BlogCard
              id="blogCard2"
              category="Design Trends"
              date="December 8, 2024"
              title="Biophilic Design: Bringing Nature Indoors"
              excerpt="How incorporating natural elements into architectural design enhances well-being and creates more harmonious living spaces."
              image="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            />
            <BlogCard
              id="blogCard3"
              category="Urban Design"
              date="November 28, 2024"
              title="Urban Planning for the Next Generation"
              excerpt="Rethinking city planning to address climate change, population growth, and the evolving needs of modern communities."
              image="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            />
          </div>
        </div>
      </section>

     

      <Footer />
    </>
  );
}
