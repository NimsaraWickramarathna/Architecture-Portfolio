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

export default function HomePage() {
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
              For over a decade, we have been pushing the boundaries of
              architectural design, creating spaces that inspire and endure. Our
              commitment to innovation, sustainability and client satisfaction
              has established us as leaders in modern architecture and interior
              design.
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
                We believe that architecture should not only serve functional
                needs but also inspire and elevate the human experience. Our
                designs blend form and function, creating spaces that are both
                beautiful and practical.
              </p>
              <p>
                Sustainability is at the core of our practice. We incorporate
                eco-friendly materials and energy-efficient solutions in all our
                projects, ensuring minimal environmental impact while maximizing
                comfort and efficiency.
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

      {/* Projects */}
      <section className="projects-preview section section-light" id="projects">
        <div className="container">
          <SectionTitle
            title="Featured Projects"
            desc="Explore our diverse portfolio of architectural masterpieces that showcase innovation, sustainability, and exceptional design."
          />

          <div className="projects-grid">
            <ProjectCard
              id="projectCard1"
              category="Residential"
              title="Modern Residential Complex"
              desc="A contemporary living space that seamlessly blends form and function, featuring sustainable materials and innovative design solutions."
              image="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            />
            <ProjectCard
              id="projectCard2"
              category="Residential"
              title="Skyline Residential Tower"
              desc="A 32-story luxury residential tower featuring sustainable design elements and panoramic city views."
              image="https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            />
            <ProjectCard
              id="projectCard3"
              category="Commercial"
              title="Tech Innovation Campus"
              desc="A modern office complex designed to foster collaboration and innovation in the tech industry."
              image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            />
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

      {/* Contact */}
      <section className="contact section section-light" id="contact">
        <div className="container">
          <SectionTitle
            title="Get In Touch"
            desc="Have a project in mind or want to learn more about our services? We'd love to hear from you."
          />

          <div className="contact-container">
            <div className="contact-info" id="contactInfo">
              <h3>Contact Information</h3>

              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt" />
                  </div>
                  <div className="contact-text">
                    <h4>Our Office</h4>
                    <p>
                      123 Design Street, Creative District
                      <br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-phone" />
                  </div>
                  <div className="contact-text">
                    <h4>Phone Number</h4>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-envelope" />
                  </div>
                  <div className="contact-text">
                    <h4>Email Address</h4>
                    <p>info@creatorarchitecture.com</p>
                  </div>
                </div>
              </div>

              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <i className="fab fa-facebook-f" />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <i className="fab fa-twitter" />
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in" />
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <i className="fab fa-instagram" />
                </a>
              </div>
            </div>

            <div className="contact-form" id="contactForm">
              <h3>Send Us a Message</h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
