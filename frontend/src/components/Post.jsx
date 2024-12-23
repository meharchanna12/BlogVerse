import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types'; // Add PropTypes for validation

export default function Post({_id, title, summary, cover, content, createdAt, author}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      maxWidth: '600px',
      margin: '20px auto',
      backgroundColor: '#f9f9f9'
    }}>
      <div style={{ width: '100%', overflow: 'hidden', borderRadius: '5px' }}>
        <Link to={`/post/${_id}`} style={{
          textDecoration: 'none',
          color: "inherit",
        }}>
          <img
            src={'http://localhost:8000/' + cover}
            alt={title} // Descriptive alt text
            onError={(e) => e.target.src = '/fallback-image.jpg'} // Fallback image if the cover image fails to load
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
              borderRadius: '5px'
            }}
          />
        </Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <h2 style={{ fontSize: '1.2rem', margin: '0', color: '#333' }}>
          <Link to={`/post/${_id}`} style={{
            textDecoration: 'none',
            color: "inherit",
          }}>
            {title}
          </Link>
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#777' }}>
          <a 
            style={{ textDecoration: 'none', color: '#555', fontWeight: 'bold' }}
            href={`/profile/${author.username}`} // Link to author's profile if needed
          >
            {author.username}
          </a>
          <time style={{ marginLeft: '10px', color: '#777' }}>
            {formatISO9075(new Date(createdAt))}
          </time>
        </p>
        <p style={{ fontSize: '1rem', color: '#555', margin: '0' }}>
          {summary}
        </p>
      </div>
    </div>
  );
}

// PropTypes validation
Post.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  summary: PropTypes.string.isRequired,
  cover: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  author: PropTypes.shape({
    username: PropTypes.string.isRequired
  }).isRequired
};
