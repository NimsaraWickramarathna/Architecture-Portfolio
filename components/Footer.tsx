import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h4>About Us</h4>
            <p>
              We are a leading architecture firm specializing in innovative, sustainable designs that
              transform spaces and inspire communities.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>
              <a href="#" className="social-link" aria-label="Twitter"><i className="fab fa-twitter" /></a>
              <a href="#" className="social-link" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a>
              <a href="#" className="social-link" aria-label="Instagram"><i className="fab fa-instagram" /></a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Services</h4>
            <ul className="footer-links">
              <li><a href="#">Architectural Design</a></li>
              <li><a href="#">Interior Design</a></li>
              <li><a href="#">Urban Planning</a></li>
              <li><a href="#">Sustainable Design</a></li>
              <li><a href="#">Project Management</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Newsletter</h4>
            <p>Subscribe to our newsletter to receive updates on our latest projects and design insights.</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Creator Architecture. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
