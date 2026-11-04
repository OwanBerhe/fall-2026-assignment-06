import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getArticle, deleteArticle, type Article } from '../api';
import { CommentSection } from '../components/CommentSection';

export const ArticleDetailPage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const numericId = Number(articleId);
  const isInvalidId = !articleId || Number.isNaN(numericId);

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(!isInvalidId);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isInvalidId) return;

    let isMounted = true;

    getArticle(numericId)
      .then((data) => {
        if (isMounted) {
          setArticle(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : 'Failed to load article',
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [numericId, isInvalidId]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteArticle(numericId);
      navigate('/');
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : 'Failed to delete article',
      );
      setIsDeleting(false);
    }
  };

  const displayError = isInvalidId ? 'Invalid article ID' : error;
  const isLoading = !isInvalidId && loading;

  return (
    <div>
      <Link to="/" className="back-link">
        &larr; Back to articles
      </Link>

      {isLoading && (
        <div className="status-message status-loading" role="status">
          Loading...
        </div>
      )}

      {!isLoading && displayError && (
        <div className="status-message status-error" role="alert">
          <p>{displayError}</p>
        </div>
      )}

      {!isLoading && !displayError && article && (
        <article className="article-detail">
          {deleteError && (
            <div className="status-message status-error" role="alert">
              <p>{deleteError}</p>
            </div>
          )}

          <header className="article-detail-header">
            <h1 className="article-detail-title">{article.title}</h1>
            <div className="article-actions">
              <Link
                to={`/articles/${article.articleId}/edit`}
                className="btn btn-secondary"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn btn-danger"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </header>

          <div className="article-content">{article.contents}</div>

          <CommentSection articleId={article.articleId} />
        </article>
      )}
    </div>
  );
};
