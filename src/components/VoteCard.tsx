import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Minus, MessageSquare, ExternalLink, Calendar } from 'lucide-react';
import { Measure, VoteChoice } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Progress } from './ui/Progress';
import { CommentSection } from './CommentSection';
import { useCastVote, useUserVote } from '../hooks/useVotes';

interface VoteCardProps {
  measure: Measure;
}

export function VoteCard({ measure }: VoteCardProps) {
  const [showComments, setShowComments] = useState(false);
  const { data: userVote } = useUserVote(measure.id);
  const castVoteMutation = useCastVote();

  const totalVotes = measure.totals.pro + measure.totals.contra + measure.totals.abstain;
  const hasVoted = !!userVote;

  const proPct = totalVotes > 0 ? (measure.totals.pro / totalVotes) * 100 : 0;
  const contraPct = totalVotes > 0 ? (measure.totals.contra / totalVotes) * 100 : 0;
  const abstainPct = totalVotes > 0 ? (measure.totals.abstain / totalVotes) * 100 : 0;

  const majority =
    measure.totals.pro > measure.totals.contra
      ? 'PRO'
      : measure.totals.contra > measure.totals.pro
      ? 'CONTRA'
      : 'Gleichstand';

  const handleVote = (choice: VoteChoice) => {
    if (!hasVoted) {
      castVoteMutation.mutate({ measureId: measure.id, choice });
    }
  };

  const daysLeft = Math.ceil((new Date(measure.endAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={measure.origin === 'user' ? 'warning' : 'primary'}>
              {measure.origin === 'user' ? 'Bürgerentwurf' : measure.category}
            </Badge>
            {measure.status === 'draft' && <Badge variant="default">Entwurf</Badge>}
            {measure.oracle?.dokumentnummer && (
              <span className="text-xs text-gray-500">{measure.oracle.dokumentnummer}</span>
            )}
          </div>

          <h3 className="text-xl font-semibold text-gray-900 leading-tight">{measure.title}</h3>
          <p className="text-gray-600 text-sm">{measure.summary}</p>

          {measure.origin === 'user' && measure.submittedBy && (
            <p className="text-xs text-gray-500">
              Eingereicht von {measure.submittedBy.displayName}
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-1 text-right">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{daysLeft > 0 ? `${daysLeft}d` : 'Abgelaufen'}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3" role="group" aria-label="Abstimmungsoptionen">
        <Button
          variant="success"
          className="flex-1 flex items-center justify-center gap-2"
          onClick={() => handleVote('pro')}
          disabled={hasVoted}
          aria-pressed={userVote?.choice === 'pro'}
        >
          <ThumbsUp className="w-4 h-4" />
          PRO
        </Button>

        <Button
          variant="danger"
          className="flex-1 flex items-center justify-center gap-2"
          onClick={() => handleVote('contra')}
          disabled={hasVoted}
          aria-pressed={userVote?.choice === 'contra'}
        >
          <ThumbsDown className="w-4 h-4" />
          CONTRA
        </Button>

        <Button
          variant="neutral"
          className="flex-1 flex items-center justify-center gap-2"
          onClick={() => handleVote('abstain')}
          disabled={hasVoted}
          aria-pressed={userVote?.choice === 'abstain'}
        >
          <Minus className="w-4 h-4" />
          ENTHALTUNG
        </Button>
      </div>

      <AnimatePresence>
        {hasVoted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 pt-2"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-success font-medium">PRO {proPct.toFixed(1)}%</span>
                  <span className="text-gray-600">{measure.totals.pro}</span>
                </div>
                <Progress value={measure.totals.pro} max={totalVotes} variant="success" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-danger font-medium">CONTRA {contraPct.toFixed(1)}%</span>
                  <span className="text-gray-600">{measure.totals.contra}</span>
                </div>
                <Progress value={measure.totals.contra} max={totalVotes} variant="danger" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">ENTHALTUNG {abstainPct.toFixed(1)}%</span>
                  <span className="text-gray-600">{measure.totals.abstain}</span>
                </div>
                <Progress value={measure.totals.abstain} max={totalVotes} variant="default" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="text-sm">
                <span className="font-semibold text-gray-900">
                  {majority !== 'Gleichstand' ? `Mehrheit: ${majority}` : 'Gleichstand'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Stimmen gesamt: {totalVotes} / Quorum: {measure.quorum}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Kommentare
        </Button>

        <div className="flex items-center gap-2">
          {measure.sources.length > 0 && (
            <a
              href={measure.sources[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              PDF <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <Link to={`/measure/${measure.id}`} className="text-sm text-primary hover:underline">
            Details
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <CommentSection measureId={measure.id} />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
