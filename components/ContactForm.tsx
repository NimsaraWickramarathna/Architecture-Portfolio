"use client";

export default function ContactForm() {
  return (
    <form
      id="contactFormElement"
      onSubmit={(e) => {
        e.preventDefault();
        alert("Thank you for your message! We will get back to you soon.");
        (e.currentTarget as HTMLFormElement).reset();
      }}
    >
      <div className="form-group">
        <label htmlFor="name">Your Name</label>
        <input type="text" id="name" className="form-control" required />
      </div>

      <div className="form-group">
        <label htmlFor="email">Your Email</label>
        <input type="email" id="email" className="form-control" required />
      </div>

      <div className="form-group">
        <label htmlFor="subject">Subject</label>
        <input type="text" id="subject" className="form-control" required />
      </div>

      <div className="form-group">
        <label htmlFor="message">Your Message</label>
        <textarea id="message" className="form-control" rows={5} required />
      </div>

      <button type="submit" className="btn-primary submit-btn">
        Send Message
      </button>
    </form>
  );
}
