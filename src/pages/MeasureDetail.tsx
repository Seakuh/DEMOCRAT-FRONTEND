import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, Users } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { useMeasure } from '../hooks/useMeasures';
import { useUserVote } from '../hooks/useVotes';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { CommentSection } from '../components/CommentSection';
import { Skeleton } from '../components/ui/Skeleton';

export function MeasureDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: measure, isLoading } = useMeasure(id!);
  const { data: userVote } = useUserVote(id!);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!measure) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Gesetzentwurf nicht gefunden
        </h2>
        <Link to="/" className="text-primary hover:underline">
          Zurück zur Übersicht
        </Link>
      </div>
    );
  }

  const totals = (measure as any).totals || {
    pro: (measure as any).votes?.YES || 0,
    contra: (measure as any).votes?.NO || 0,
    abstain: (measure as any).votes?.ABSTAIN || 0,
  };

  const totalVotes = totals.pro + totals.contra + totals.abstain;
  const proPct = totalVotes > 0 ? (totals.pro / totalVotes) * 100 : 0;
  const contraPct = totalVotes > 0 ? (totals.contra / totalVotes) * 100 : 0;
  const abstainPct = totalVotes > 0 ? (totals.abstain / totalVotes) * 100 : 0;

  const daysLeft = measure.endAt 
    ? Math.ceil((new Date(measure.endAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  const displayTitle = (measure as any).titel || measure.title;
  const displaySummary = (measure as any).abstract || measure.summary;
  const displayCategory = (measure as any).ressort || measure.category;
  const displayId = (measure as any)._id || measure.id;

  const createdAt = (measure as any).datum || (measure as any).createdAt;
  const formattedDate = createdAt 
    ? new Date(createdAt).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : '';

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Übersicht
        </Link>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={measure.origin === 'user' ? 'warning' : 'primary'} className="px-3 py-1 text-xs uppercase tracking-wider font-bold">
                {measure.origin === 'user' ? 'Bürgerentwurf' : displayCategory}
              </Badge>
              {measure.status === 'draft' && <Badge variant="neutral">Entwurf</Badge>}
              {((measure as any).dokumentnummer || measure.oracle?.dokumentnummer) && (
                <span className="text-sm font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                  { (measure as any).dokumentnummer || measure.oracle.dokumentnummer }
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-[1.1] tracking-tight">
              {displayTitle}
            </h1>

            <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Veröffentlicht am {formattedDate}</span>
              </div>
              {measure.endAt && (
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${daysLeft > 0 ? 'bg-success' : 'bg-danger'}`} />
                  <span>{daysLeft > 0 ? `${daysLeft} Tage verbleibend` : 'Abgelaufen'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 shadow-sm border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              Zusammenfassung
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              {displaySummary || "Keine Zusammenfassung verfügbar."}
            </div>
            
            {measure.bodyMarkdown && (
              <>
                <div className="my-8 border-t border-gray-100" />
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Details</h2>
                <div className="prose prose-blue max-w-none">
                  <ReactMarkdown>{measure.bodyMarkdown}</ReactMarkdown>
                </div>
              </>
            )}
          </Card>

          <Card className="p-8 shadow-sm border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              Diskussion
            </h2>
            <CommentSection measureId={displayId} />
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="p-8 shadow-xl border-none bg-gray-900 text-white sticky top-8">
            <h3 className="text-xl font-bold mb-6">Live-Ergebnis</h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-success-light uppercase tracking-widest">Dafür</span>
                  <span className="text-lg font-mono font-bold">{proPct.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${proPct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-success h-full"
                  />
                </div>
                <div className="text-right text-xs text-gray-400">{totals.pro} Stimmen</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-danger-light uppercase tracking-widest">Dagegen</span>
                  <span className="text-lg font-mono font-bold">{contraPct.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${contraPct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-danger h-full"
                  />
                </div>
                <div className="text-right text-xs text-gray-400">{totals.contra} Stimmen</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Enthaltung</span>
                  <span className="text-lg font-mono font-bold">{abstainPct.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${abstainPct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-gray-500 h-full"
                  />
                </div>
                <div className="text-right text-xs text-gray-400">{totals.abstain} Stimmen</div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 text-sm">Gesamtstimmen:</span>
                <span className="text-xl font-bold">{totalVotes}</span>
              </div>
              {(measure as any).quorum && (
                <div className="bg-white/5 rounded-lg p-3 text-xs text-gray-300">
                  Erforderliches Quorum: <span className="text-white font-bold">{(measure as any).quorum}</span>
                </div>
              )}
            </div>
            
            {userVote && (
              <div className="mt-6 p-4 bg-primary/20 border border-primary/30 rounded-xl text-center">
                <p className="text-sm text-primary-light font-bold uppercase tracking-widest mb-1">Deine Entscheidung</p>
                <p className="text-xl font-black">{userVote.choice.toUpperCase()}</p>
              </div>
            )}
          </Card>

          {((measure as any).pdfUrl || (measure.sources && measure.sources.length > 0)) && (
            <Card className="p-6 border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Dokumente</h3>
              <a
                href={(measure as any).pdfUrl || measure.sources[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-danger/10 text-danger rounded">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Original PDF (Bundestag)</span>
                </div>
                <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180 group-hover:translate-x-1 transition-transform" />
              </a>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
