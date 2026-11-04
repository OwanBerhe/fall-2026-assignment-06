import React, { useState, useEffect } from 'react';
import { listComments, type Comment } from '../api';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';

interface CommentSectionProps {
  articleId: number;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  articleId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    listComments(articleId)
      .then((data) => {
        if (isMounted) {
          setComments(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : 'Failed to load comments',
          );
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [articleId]);

  const handleCommentAdded = (newComment: Comment) => {
    setComments((prev) => [...prev, newComment]);
  };

  const handleCommentUpdated = (updatedComment: Comment) => {
    setComments((prev) =>
      prev.map((c) =>
        c.commentId === updatedComment.commentId ? updatedComment : c,
      ),
    );
  };

  const handleCommentDeleted = (commentId: number) => {
    setComments((prev) => prev.filter((c) => c.commentId !== commentId));
    if (editingCommentId === commentId) {
      setEditingCommentId(null);
    }
  };

  return (
    <section className="comments-section" aria-label="Comments">
      <h2 className="comments-header">Comments</h2>

      {loading && (
        <div className="status-message status-loading" role="status">
          Loading comments...
        </div>
      )}

      {!loading && error && (
        <div className="status-message status-error" role="alert">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && comments.length === 0 && (
        <div className="status-message status-empty">
          No comments yet.
        </div>
      )}

      {!loading && !error && comments.length > 0 && (
        <ul className="comments-list" aria-label="Comments list">
          {comments.map((comment) => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              articleId={articleId}
              isEditing={editingCommentId === comment.commentId}
              onStartEdit={() => setEditingCommentId(comment.commentId)}
              onCancelEdit={() => setEditingCommentId(null)}
              onUpdate={handleCommentUpdated}
              onDelete={handleCommentDeleted}
            />
          ))}
        </ul>
      )}

      <CommentForm
        articleId={articleId}
        onCommentAdded={handleCommentAdded}
      />
    </section>
  );
};
