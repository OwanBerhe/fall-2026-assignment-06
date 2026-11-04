import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getArticle, updateArticle, type Article } from '../api';
import { ArticleForm, type ArticleFormValues } from '../components/ArticleForm';

export const EditArticlePage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const numericId = Number(articleId);
  const isInvalidId = !articleId || Number.isNaN(numericId);

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(!isInvalidId);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
          setLoadError(
            err instanceof Error ? err.message : 'Failed to load article',
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [numericId, isInvalidId]);

  const handleSubmit = async (data: ArticleFormValues) => {
    setSubmitError(null);
    try {
      const updatedArticle = await updateArticle(numericId, data);
      navigate(`/articles/${updatedArticle.articleId}`);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to update article',
      );
    }
  };

  const displayLoadError = isInvalidId ? 'Invalid article ID' : loadError;
  const isLoading = !isInvalidId && loading;

  return (
    <div>
      <Link
        to={article ? `/articles/${article.articleId}` : '/'}
        className="back-link"
      >
        &larr; Back to {article ? 'article' : 'articles'}
      </Link>

      <header className="page-header">
        <h1>Edit Article</h1>
      </header>

      {isLoading && (
        <div className="status-message status-loading" role="status">
          Loading...
        </div>
      )}

      {!isLoading && displayLoadError && (
        <div className="status-message status-error" role="alert">
          <p>{displayLoadError}</p>
        </div>
      )}

      {!isLoading && !displayLoadError && article && (
        <ArticleForm
          key={article.articleId}
          initialValues={{
            title: article.title,
            contents: article.contents,
          }}
          onSubmit={handleSubmit}
          submitButtonLabel="Save Changes"
          cancelPath={`/articles/${article.articleId}`}
          errorMessage={submitError}
        />
      )}
    </div>
  );
};
