"use client";

export default function NewsletterForm() {
  return (
    <form
      id="newsletterForm"
      onSubmit={(e) => {
        e.preventDefault();
        alert("Thank you for subscribing to our newsletter!");
        (e.currentTarget as HTMLFormElement).reset();
      }}
    >
      <div className="form-group">
        <input type="email" className="form-control" placeholder="Your Email" required />
      </div>
      <button type="submit" className="btn-primary submit-btn">
        Subscribe
      </button>
    </form>
  );
}
