import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createArticle } from '../api';
import { ArticleForm, type ArticleFormValues } from '../components/ArticleForm';

export const CreateArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ArticleFormValues) => {
    setError(null);
    try {
      const newArticle = await createArticle(data);
      navigate(`/articles/${newArticle.articleId}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create article',
      );
    }
  };

  return (
    <main>
      <Link to="/" className="back-link">
        &larr; Back to articles
      </Link>

      <header className="page-header">
        <h1>Create Article</h1>
      </header>

      <ArticleForm
        onSubmit={handleSubmit}
        submitButtonLabel="Create Article"
        cancelPath="/"
        errorMessage={error}
      />
    </main>
  );
};
