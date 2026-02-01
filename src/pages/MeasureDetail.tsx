import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, Users } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useMeasure } from '../hooks/useMeasures';
import { useUserVote } from '../hooks/useVotes';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
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

  const totalVotes = measure.totals.pro + measure.totals.contra + measure.totals.abstain;
  const proPct = totalVotes > 0 ? (measure.totals.pro / totalVotes) * 100 : 0;
  const contraPct = totalVotes > 0 ? (measure.totals.contra / totalVotes) * 100 : 0;
  const daysLeft = Math.ceil((new Date(measure.endAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Zurück zur Übersicht
      </Link>

      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={measure.origin === 'user' ? 'warning' : 'primary'}>
                {measure.origin === 'user' ? 'Bürgerentwurf' : measure.category}
              </Badge>
              {measure.status === 'draft' && <Badge variant="default">Entwurf</Badge>}
              {measure.oracle?.dokumentnummer && (
                <span className="text-sm text-gray-500">
                  Drucksache {measure.oracle.dokumentnummer}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {measure.title}
            </h1>

            {measure.origin === 'user' && measure.submittedBy && (
              <p className="text-sm text-gray-600">
                Eingereicht von {measure.submittedBy.displayName}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{daysLeft > 0 ? `${daysLeft} Tage verbleibend` : 'Abgelaufen'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{totalVotes} Stimmen</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Volltext
            </h2>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{measure.bodyMarkdown}</ReactMarkdown>
            </div>
          </Card>

          {measure.sources.length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quellen & Dokumente
              </h2>
              <ul className="space-y-2">
                {measure.sources.map((source, idx) => (
                  <li key={idx}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      {source.label}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Kommentare
            </h2>
            <CommentSection measureId={measure.id} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Aktuelles Ergebnis
            </h3>

            {userVote && (
              <div className="mb-4 p-3 bg-primary/5 rounded-lg">
                <p className="text-sm font-medium text-gray-900">
                  Ihre Stimme: {userVote.choice.toUpperCase()}
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-success">PRO</span>
                  <span className="text-sm text-gray-600">
                    {proPct.toFixed(1)}% ({measure.totals.pro})
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-success h-3 rounded-full transition-all duration-500"
                    style={{ width: `${proPct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-danger">CONTRA</span>
                  <span className="text-sm text-gray-600">
                    {contraPct.toFixed(1)}% ({measure.totals.contra})
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-danger h-3 rounded-full transition-all duration-500"
                    style={{ width: `${contraPct}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-500">ENTHALTUNG</span>
                  <span className="text-sm text-gray-600">
                    {(100 - proPct - contraPct).toFixed(1)}% ({measure.totals.abstain})
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gray-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${100 - proPct - contraPct}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Quorum:</span>
                <span className="font-semibold">
                  {totalVotes} / {measure.quorum}
                </span>
              </div>
            </div>
          </Card>

          {measure.oracle && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Oracle / Datenquelle
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Quelle:</span>
                  <span className="ml-2 font-medium">DIP Bundestag</span>
                </div>
                {measure.oracle.wahlperiode && (
                  <div>
                    <span className="text-gray-600">Wahlperiode:</span>
                    <span className="ml-2 font-medium">{measure.oracle.wahlperiode}</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {measure.origin === 'user' && (
            <Card className="p-6 bg-warning/5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Hinweis
              </h3>
              <p className="text-sm text-gray-700">
                Dieser Entwurf wurde von einem Bürger eingereicht und ist noch nicht offiziell geprüft.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
