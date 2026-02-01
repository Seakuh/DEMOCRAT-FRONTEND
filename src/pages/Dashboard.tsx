import { useState } from 'react';
import { AlertCircle, CheckCircle, Loader, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMeasures } from '../hooks/useMeasures';
import { useDipGesetzentwuerfe } from '../hooks/useDipOracle';
import { Composer } from '../components/Composer';
import { VoteCard } from '../components/VoteCard';
import { VoteCardSkeleton } from '../components/ui/Skeleton';
import { Card } from '../components/ui/Card';
import { MeasureStatus } from '../types';
import { syncApi, Drucksache } from '../services/api';
import { Button } from '../components/ui/Button';

export function Dashboard() {
  const { data: measures, isLoading: measuresLoading, refetch: refetchMeasures } = useMeasures();
  const { data: dipData, isError: dipError } = useDipGesetzentwuerfe();
  const [statusFilter, setStatusFilter] = useState<MeasureStatus | 'all'>('all');
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      await syncApi.triggerSync();
      await refetchMeasures();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredMeasures = (measures as Drucksache[] | undefined)?.filter((m: Drucksache) =>
    statusFilter === 'all' ? true : m.drucksachetyp === statusFilter
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Direkte Abstimmung über Gesetzesänderungen
        </h2>
        <p className="text-gray-600">
          Beteiligen Sie sich an der demokratischen Entscheidungsfindung
        </p>
      </div>

      <Composer />

      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-900">Aktuelle Drucksachen</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSync} 
          disabled={isSyncing}
          className="flex items-center gap-2 border border-gray-200"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Synchronisiere...' : 'Jetzt synchronisieren'}
        </Button>
      </div>

      {dipError && (
        <Card className="p-4 bg-warning/10 border-warning">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-gray-800 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Oracle nicht verfügbar
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Die Verbindung zur DIP Bundestag API konnte nicht hergestellt werden. Es werden nur lokale Daten angezeigt.
              </p>
            </div>
          </div>
        </Card>
      )}

      {!dipError && dipData && (
        <Card className="p-4 bg-success/5 border-success/20">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Oracle verbunden
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Verbunden mit DIP Bundestag API – {dipData.numFound} Gesetzentwürfe verfügbar
              </p>
            </div>
          </div>
        </Card>
      )}

      <div>
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Alle
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'active'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Aktiv
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'draft'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Entwurf
          </button>
          <button
            onClick={() => setStatusFilter('resolved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === 'resolved'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Abgeschlossen
          </button>
        </div>

        {measuresLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <VoteCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredMeasures && filteredMeasures.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {filteredMeasures.map((measure: Drucksache) => (
              <motion.div key={measure._id} variants={item}>
                <VoteCard measure={measure as any} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card className="p-8">
            <div className="text-center text-gray-600">
              <Loader className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Keine Abstimmungen in dieser Kategorie</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
