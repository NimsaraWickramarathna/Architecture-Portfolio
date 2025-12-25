import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          {/* About */}
          <div className="footer-column">
            <h4>About Us</h4>
            <p>
              We are a leading architecture firm specializing in innovative, sustainable designs that
              transform spaces and inspire communities.
            </p>

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

          {/* Quick Links */}
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/about">About</Link>
              </li>
              <li>
                <Link href="/projects">Projects</Link>
              </li>
              <li>
                <Link href="/blogs">Blogs</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-column">
            <h4>Contact Info</h4>
            <ul className="footer-links">
              <li>
                <span>
                  <i className="fas fa-map-marker-alt" style={{ marginRight: 8 }} />
                  123 Design Street, New York, NY 10001
                </span>
              </li>
              <li>
                <a href="tel:+15551234567">
                  <i className="fas fa-phone" style={{ marginRight: 8 }} />
                  +1 (555) 123-4567
                </a>
              </li>
              <li>
                <a href="mailto:info@creatorarchitecture.com">
                  <i className="fas fa-envelope" style={{ marginRight: 8 }} />
                  info@creatorarchitecture.com
                </a>
              </li>
              <li>
                <span>
                  <i className="far fa-clock" style={{ marginRight: 8 }} />
                  Mon – Sat: 9:00 AM – 6:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Creator Architecture. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
