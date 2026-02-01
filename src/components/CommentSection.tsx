import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useComments, useAddComment } from '../hooks/useComments';
import { Button } from './ui/Button';

interface CommentSectionProps {
  measureId: string;
}

export function CommentSection({ measureId }: CommentSectionProps) {
  const [commentBody, setCommentBody] = useState('');
  const { data: comments, isLoading } = useComments(measureId);
  const addCommentMutation = useAddComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentBody.trim()) {
      addCommentMutation.mutate(
        { measureId, body: commentBody },
        {
          onSuccess: () => setCommentBody(''),
        }
      );
    }
  };

  return (
    <div className="border-t border-gray-200 pt-4 space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Kommentar schreiben..."
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!commentBody.trim() || addCommentMutation.isPending}
          className="flex items-center gap-1"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>

      {isLoading ? (
        <div className="text-sm text-gray-500">Lade Kommentare...</div>
      ) : (
        <div className="space-y-3">
          {comments && comments.length > 0 ? (
            comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-lg p-3"
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {comment.userDisplayName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString('de-DE', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{comment.body}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Noch keine Kommentare. Seien Sie der Erste!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
