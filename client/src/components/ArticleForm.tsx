import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export interface ArticleFormValues {
  title: string;
  contents: string;
}

export interface ArticleFormProps {
  initialValues?: {
    title?: string;
    contents?: string;
  };
  initialTitle?: string;
  initialContents?: string;
  onSubmit: (values: ArticleFormValues) => Promise<void>;
  submitButtonLabel?: string;
  submitButtonText?: string;
  cancelPath: string;
  errorMessage?: string | null;
  apiError?: string | null;
  isSubmitting?: boolean;
}

export const ArticleForm: React.FC<ArticleFormProps> = ({
  initialValues,
  initialTitle = '',
  initialContents = '',
  onSubmit,
  submitButtonLabel,
  submitButtonText,
  cancelPath,
  errorMessage,
  apiError,
  isSubmitting: isSubmittingProp,
}) => {
  const resolvedInitialTitle = initialValues?.title ?? initialTitle;
  const resolvedInitialContents = initialValues?.contents ?? initialContents;
  const resolvedButtonLabel =
    submitButtonLabel ?? submitButtonText ?? 'Submit';
  const resolvedError = errorMessage ?? apiError;

  const [title, setTitle] = useState(resolvedInitialTitle);
  const [contents, setContents] = useState(resolvedInitialContents);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [contentsError, setContentsError] = useState<string | null>(null);
  const [formValidationMessage, setFormValidationMessage] = useState<
    string | null
  >(null);
  const [submittingInternal, setSubmittingInternal] = useState(false);

  // Sync internal state if initialValues changes
  useEffect(() => {
    if (initialValues) {
      if (initialValues.title !== undefined) setTitle(initialValues.title);
      if (initialValues.contents !== undefined)
        setContents(initialValues.contents);
    }
  }, [initialValues?.title, initialValues?.contents]);

  const isBusy = isSubmittingProp ?? submittingInternal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    const trimmedTitle = title.trim();
    const trimmedContents = contents.trim();

    if (!trimmedTitle) {
      setTitleError('Title cannot be blank.');
      hasError = true;
    } else {
      setTitleError(null);
    }

    if (!trimmedContents) {
      setContentsError('Contents cannot be blank.');
      hasError = true;
    } else {
      setContentsError(null);
    }

    if (hasError) {
      setFormValidationMessage('Both title and contents are required.');
      return;
    }

    setFormValidationMessage(null);
    setSubmittingInternal(true);
    try {
      await onSubmit({ title: trimmedTitle, contents: trimmedContents });
    } finally {
      setSubmittingInternal(false);
    }
  };

  return (
    <form className="article-form" onSubmit={handleSubmit} noValidate>
      {formValidationMessage && (
        <div className="status-message status-error" role="alert">
          <p>{formValidationMessage}</p>
        </div>
      )}

      {resolvedError && (
        <div className="status-message status-error" role="alert">
          <p>{resolvedError}</p>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="article-title" className="form-label">
          Title
        </label>
        <input
          id="article-title"
          type="text"
          className={`form-input ${titleError ? 'has-error' : ''}`}
          placeholder="Enter article title..."
          value={title}
          disabled={isBusy}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError(null);
            if (formValidationMessage) setFormValidationMessage(null);
          }}
        />
        {titleError && (
          <span className="field-error" role="alert">
            {titleError}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="article-contents" className="form-label">
          Contents
        </label>
        <textarea
          id="article-contents"
          className={`form-textarea ${contentsError ? 'has-error' : ''}`}
          placeholder="Write your article contents here..."
          value={contents}
          disabled={isBusy}
          rows={10}
          onChange={(e) => {
            setContents(e.target.value);
            if (contentsError) setContentsError(null);
            if (formValidationMessage) setFormValidationMessage(null);
          }}
        />
        {contentsError && (
          <span className="field-error" role="alert">
            {contentsError}
          </span>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={isBusy}>
          {isBusy ? 'Saving...' : resolvedButtonLabel}
        </button>
        <Link to={cancelPath} className="btn btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
};
