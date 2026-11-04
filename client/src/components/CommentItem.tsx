import React, { useState } from 'react';
import { updateComment, deleteComment, type Comment } from '../api';

interface CommentItemProps {
  comment: Comment;
  articleId: number;
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (updatedComment: Comment) => void;
  onDelete: (commentId: number) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  articleId,
  isEditing,
  onStartEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}) => {
  const [editBody, setEditBody] = useState(comment.body);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStartEdit = () => {
    setEditBody(comment.body);
    setValidationError(null);
    setActionError(null);
    onStartEdit();
  };

  const handleCancelEdit = () => {
    setEditBody(comment.body);
    setValidationError(null);
    setActionError(null);
    onCancelEdit();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = editBody.trim();

    if (!trimmed) {
      setValidationError('Comment cannot be blank.');
      return;
    }

    setValidationError(null);
    setActionError(null);
    setIsSaving(true);

    try {
      const updated = await updateComment(articleId, comment.commentId, {
        body: trimmed,
      });
      onUpdate(updated);
      onCancelEdit();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Failed to update comment',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setActionError(null);
    setIsDeleting(true);

    try {
      await deleteComment(articleId, comment.commentId);
      onDelete(comment.commentId);
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Failed to delete comment',
      );
      setIsDeleting(false);
    }
  };

  return (
    <li className="comment-item">
      {actionError && (
        <div className="status-message status-error" role="alert">
          <p>{actionError}</p>
        </div>
      )}

      {isEditing ? (
        <form className="comment-edit-form" onSubmit={handleSave} noValidate>
          {validationError && (
            <span className="field-error" role="alert">
              {validationError}
            </span>
          )}
          <textarea
            className={`form-textarea comment-textarea ${
              validationError ? 'has-error' : ''
            }`}
            value={editBody}
            disabled={isSaving}
            rows={3}
            aria-label="Edit comment body"
            onChange={(e) => {
              setEditBody(e.target.value);
              if (validationError) setValidationError(null);
            }}
          />
          <div className="comment-actions">
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              disabled={isSaving}
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="comment-read-view">
          <p className="comment-body">{comment.body}</p>
          <div className="comment-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleStartEdit}
              disabled={isDeleting}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </li>
  );
};
