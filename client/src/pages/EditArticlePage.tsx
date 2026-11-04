import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getArticle, updateArticle, type Article } from '../api';
import { ArticleForm, type ArticleFormValues } from '../components/ArticleForm';

export const EditArticlePage: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const numericId = Number(articleId);

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!articleId || Number.isNaN(numericId)) {
      setLoadError('Invalid article ID');
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setLoadError(null);

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
  }, [articleId, numericId]);

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

  return (
    <main>
      <Link
        to={article ? `/articles/${article.articleId}` : '/'}
        className="back-link"
      >
        &larr; Back to {article ? 'article' : 'articles'}
      </Link>

      <header className="page-header">
        <h1>Edit Article</h1>
      </header>

      {loading && (
        <div className="status-message status-loading" role="status">
          Loading...
        </div>
      )}

      {!loading && loadError && (
        <div className="status-message status-error" role="alert">
          <p>{loadError}</p>
        </div>
      )}

      {!loading && !loadError && article && (
        <ArticleForm
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
    </main>
  );
};
