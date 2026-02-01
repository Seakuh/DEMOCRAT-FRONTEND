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
import { ConfirmationModal } from './ui/ConfirmationModal';

interface VoteCardProps {
  measure: Measure;
}

export function VoteCard({ measure }: VoteCardProps) {
  const displayId = (measure as any)._id || measure.id;
  const [showComments, setShowComments] = useState(false);
  const [pendingVote, setPendingVote] = useState<VoteChoice | null>(null);
  const { data: userVote } = useUserVote(displayId);
  const castVoteMutation = useCastVote();

  const handleVoteClick = (choice: VoteChoice) => {
    if (!hasVoted) {
      setPendingVote(choice);
    }
  };

  const confirmVote = () => {
    if (pendingVote) {
      const voteValue = pendingVote === 'pro' ? 'YES' : pendingVote === 'contra' ? 'NO' : 'ABSTAIN';
      castVoteMutation.mutate({ measureId: displayId, choice: voteValue as any });
      
      // Lokal speichern
      const localVotes = JSON.parse(localStorage.getItem('my_votes') || '{}');
      localVotes[displayId] = voteValue;
      localStorage.setItem('my_votes', JSON.stringify(localVotes));
      
      setPendingVote(null);
    }
  };

  const totals = (measure as any).totals || {
    pro: (measure as any).votes?.YES || 0,
    contra: (measure as any).votes?.NO || 0,
    abstain: (measure as any).votes?.ABSTAIN || 0,
  };

  const totalVotes = totals.pro + totals.contra + totals.abstain;
  const hasVoted = !!userVote;

  const proPct = totalVotes > 0 ? (totals.pro / totalVotes) * 100 : 0;
  const contraPct = totalVotes > 0 ? (totals.contra / totalVotes) * 100 : 0;
  const abstainPct = totalVotes > 0 ? (totals.abstain / totalVotes) * 100 : 0;

  const majority =
    totals.pro > totals.contra
      ? 'PRO'
      : totals.contra > totals.pro
      ? 'CONTRA'
      : 'Gleichstand';

  const daysLeft = measure.endAt 
    ? Math.ceil((new Date(measure.endAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  const displayTitle = (measure as any).titel || measure.title;
  const displaySummary = (measure as any).abstract || measure.summary;
  const displayCategory = (measure as any).ressort || measure.category;

  const createdAt = (measure as any).datum || (measure as any).createdAt;
  const formattedDate = createdAt 
    ? new Date(createdAt).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : '';

  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex-1 space-y-2 w-full">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={measure.origin === 'user' ? 'warning' : 'primary'}>
              {measure.origin === 'user' ? 'Bürgerentwurf' : displayCategory}
            </Badge>
            {measure.status === 'draft' && <Badge variant="default">Entwurf</Badge>}
            {((measure as any).dokumentnummer || measure.oracle?.dokumentnummer) && (
              <span className="text-[10px] md:text-xs text-gray-500 font-mono">
                {(measure as any).dokumentnummer || measure.oracle?.dokumentnummer}
              </span>
            )}
          </div>

          <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">{displayTitle}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 md:line-clamp-3">{displaySummary}</p>

          {measure.origin === 'user' && measure.submittedBy && (
            <p className="text-[10px] md:text-xs text-gray-500">
              Eingereicht von {measure.submittedBy.displayName}
            </p>
          )}
        </div>

        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
          <div className="flex items-center gap-1 text-[11px] md:text-sm text-gray-600">
            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="text-[10px] md:text-xs font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-full">
            {measure.endAt ? (daysLeft > 0 ? `${daysLeft}d verbleibend` : 'Abgelaufen') : 'Dauerhaft'}
          </div>
        </div>
      </div>

      <div className="flex flex-col xs:flex-row gap-2 md:gap-3" role="group" aria-label="Abstimmungsoptionen">
        <Button
          variant="success"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 md:py-2"
          onClick={() => handleVoteClick('pro')}
          disabled={hasVoted}
          aria-pressed={userVote?.choice === 'pro'}
        >
          <ThumbsUp className="w-4 h-4" />
          <span className="xs:hidden sm:inline">PRO</span>
          <span className="hidden xs:inline sm:hidden">PRO</span>
        </Button>

        <Button
          variant="danger"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 md:py-2"
          onClick={() => handleVoteClick('contra')}
          disabled={hasVoted}
          aria-pressed={userVote?.choice === 'contra'}
        >
          <ThumbsDown className="w-4 h-4" />
          <span className="xs:hidden sm:inline">CONTRA</span>
          <span className="hidden xs:inline sm:hidden">CONTRA</span>
        </Button>

        <Button
          variant="neutral"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 md:py-2"
          onClick={() => handleVoteClick('abstain')}
          disabled={hasVoted}
          aria-pressed={userVote?.choice === 'abstain'}
        >
          <Minus className="w-4 h-4" />
          <span className="xs:hidden sm:inline text-xs sm:text-base">ENTHALTUNG</span>
          <span className="hidden xs:inline sm:hidden text-[10px]">ENTHALT.</span>
        </Button>
      </div>

      <ConfirmationModal
        isOpen={!!pendingVote}
        onClose={() => setPendingVote(null)}
        onConfirm={confirmVote}
        title="Stimme bestätigen"
        message={`Möchten Sie wirklich mit "${pendingVote?.toUpperCase()}" für diesen Entwurf stimmen? Diese Aktion kann nicht rückgängig gemacht werden.`}
        variant={pendingVote === 'pro' ? 'success' : pendingVote === 'contra' ? 'danger' : 'primary'}
        confirmText="Jetzt abstimmen"
        cancelText="Abbrechen"
      />

      <AnimatePresence>
        {hasVoted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 pt-2"
          >
            <div className="flex flex-col gap-3 pt-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] md:text-xs">
                  <span className="text-success font-bold uppercase tracking-wider">Dafür {proPct.toFixed(1)}%</span>
                  <span className="text-gray-500 font-mono">{totals.pro}</span>
                </div>
                <Progress value={totals.pro} max={totalVotes} variant="success" className="h-2" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] md:text-xs">
                  <span className="text-danger font-bold uppercase tracking-wider">Dagegen {contraPct.toFixed(1)}%</span>
                  <span className="text-gray-500 font-mono">{totals.contra}</span>
                </div>
                <Progress value={totals.contra} max={totalVotes} variant="danger" className="h-2" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] md:text-xs">
                  <span className="text-gray-500 font-bold uppercase tracking-wider">Enthalt. {abstainPct.toFixed(1)}%</span>
                  <span className="text-gray-500 font-mono">{totals.abstain}</span>
                </div>
                <Progress value={totals.abstain} max={totalVotes} variant="default" className="h-2" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100">
              <div className="text-[11px] md:text-sm">
                <span className="font-bold text-gray-900">
                  {majority !== 'Gleichstand' ? `Mehrheit: ${majority}` : 'Gleichstand'}
                </span>
              </div>
              <div className="text-[10px] md:text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                Gesamt: {totalVotes} {(measure as any).quorum && `| Quorum: ${(measure as any).quorum}`}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 px-2 py-1 h-auto text-[11px] md:text-sm"
        >
          <MessageSquare className="w-3.5 h-3.5 md:w-4 md:h-4" />
          <span>Kommentare</span>
        </Button>

        <div className="flex items-center gap-3">
          {((measure as any).pdfUrl || (measure.sources && measure.sources.length > 0)) && (
            <a
              href={(measure as any).pdfUrl || measure.sources[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] md:text-sm text-primary font-medium hover:underline flex items-center gap-1"
            >
              PDF <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <Link to={`/measure/${displayId}`} className="text-[11px] md:text-sm text-primary font-bold hover:underline">
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
            <CommentSection measureId={displayId} />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
