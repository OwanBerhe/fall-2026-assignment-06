import React, { useState } from 'react';
import { createComment, type Comment } from '../api';

interface CommentFormProps {
  articleId: number;
  onCommentAdded: (comment: Comment) => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({
  articleId,
  onCommentAdded,
}) => {
  const [body, setBody] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = body.trim();

    if (!trimmed) {
      setValidationError('Comment cannot be blank.');
      return;
    }

    setValidationError(null);
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const newComment = await createComment(articleId, { body: trimmed });
      onCommentAdded(newComment);
      setBody('');
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Failed to post comment',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-comment-section">
      <h3 className="add-comment-title">Add a Comment</h3>

      <form className="add-comment-form" onSubmit={handleSubmit} noValidate>
        {submitError && (
          <div className="status-message status-error" role="alert">
            <p>{submitError}</p>
          </div>
        )}

        <div className="form-group">
          <textarea
            className={`form-textarea comment-textarea ${
              validationError ? 'has-error' : ''
            }`}
            placeholder="Write a comment..."
            aria-label="Add a comment"
            value={body}
            disabled={isSubmitting}
            rows={3}
            onChange={(e) => {
              setBody(e.target.value);
              if (validationError) setValidationError(null);
              if (submitError) setSubmitError(null);
            }}
          />
          {validationError && (
            <span className="field-error" role="alert">
              {validationError}
            </span>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Add Comment'}
          </button>
        </div>
      </form>
    </div>
  );
};
