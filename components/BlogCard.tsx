export default function BlogCard(props: {
  id?: string;
  image: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  href?: string;
}) {
  const { id, image, category, date, title, excerpt, href = "#" } = props;

  return (
    <div className="blog-card" id={id}>
      <div className="blog-image">
        <img src={image} alt={title} />
      </div>
      <div className="blog-content">
        <div className="blog-meta">
          <span className="blog-category">{category}</span>
          <span className="blog-date">{date}</span>
        </div>
        <h3 className="blog-title">{title}</h3>
        <p className="blog-excerpt">{excerpt}</p>
        <a href={href} className="read-more">
          Read More <i className="fas fa-arrow-right" />
        </a>
      </div>
    </div>
  );
}
