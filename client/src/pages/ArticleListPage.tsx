import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listArticles, type Article } from '../api';

function truncate(text: string, maxLength = 100): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export const ArticleListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debounce the search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch articles whenever debouncedQuery changes (including on mount)
  useEffect(() => {
    let isMounted = true;

    listArticles(debouncedQuery)
      .then((data) => {
        if (isMounted) {
          setArticles(data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : 'Failed to load articles',
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery]);

  return (
    <div>
      <header className="page-header">
        <h1>Articles</h1>
      </header>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search articles by title..."
          aria-label="Search articles by title"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setLoading(true);
          }}
        />
      </div>

      {loading && (
        <div className="status-message status-loading" role="status">
          Loading...
        </div>
      )}

      {!loading && error && (
        <div className="status-message status-error" role="alert">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="status-message status-empty">
          No articles found.
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <ul className="article-list" aria-label="Articles list">
          {articles.map((article) => (
            <li key={article.articleId} className="article-card">
              <h2>
                <Link
                  to={`/articles/${article.articleId}`}
                  className="article-title-link"
                >
                  {article.title}
                </Link>
              </h2>
              <p className="article-preview">
                {truncate(article.contents, 100)}
              </p>
              <div className="article-card-footer">
                <Link
                  to={`/articles/${article.articleId}`}
                  className="article-read-more"
                >
                  Read more &rarr;
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
