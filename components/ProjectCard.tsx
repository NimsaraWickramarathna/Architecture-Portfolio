export default function ProjectCard(props: {
  id?: string;
  image: string;
  category: string;
  title: string;
  desc: string;
  href?: string;
}) {
  const { id, image, category, title, desc, href = "#" } = props;

  return (
    <div className="project-card" id={id}>
      <div className="project-image">
        <img src={image} alt={title} />
      </div>
      <div className="project-content">
        <span className="project-category">{category}</span>
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{desc}</p>
        <a href={href} className="project-link">
          View Project <i className="fas fa-arrow-right" />
        </a>
      </div>
    </div>
  );
}
