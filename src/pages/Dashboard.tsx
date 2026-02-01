import { useState } from 'react';
import { CheckCircle, Loader, Search, Calendar as CalendarIcon, X as XIcon, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMeasures, useCategories } from '../hooks/useMeasures';
import { useDipGesetzentwuerfe } from '../hooks/useDipOracle';
import { VoteCard } from '../components/VoteCard';
import { VoteCardSkeleton } from '../components/ui/Skeleton';
import { Card } from '../components/ui/Card';
import { MeasureStatus } from '../types';
import { syncApi, Drucksache } from '../services/api';
import { Button } from '../components/ui/Button';

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  const { data: categories } = useCategories();
  const { data: measures, isLoading: measuresLoading, refetch: refetchMeasures } = useMeasures(
    searchQuery,
    dateRange,
    categoryFilter || undefined
  );
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

  const filteredMeasures = (measures as Drucksache[] | undefined)?.filter((m: Drucksache) => {
    return statusFilter === 'all' ? true : m.drucksachetyp === statusFilter;
  });

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

      {/* <Composer /> */}

      <div className="space-y-4">
        {/* Search bar: full width */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Suchen nach Titel, Inhalt oder Drucksachennummer..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Zeitraum and Kategorie: next row, side by side */}
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 mt-2">

          <div className="relative w-full">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={`w-full pl-9 pr-8 py-3 bg-white border rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-sm ${
                categoryFilter ? 'border-primary text-primary' : 'border-gray-200 text-gray-700'
              }`}
            >
              <option value="">Alle Kategorien</option>
              {categories?.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="relative w-full sm:w-auto">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`w-full sm:w-auto pl-9 pr-8 py-3 bg-white border rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-sm flex items-center gap-2 ${
                showFilters ? 'border-primary text-primary bg-primary/10' : 'border-gray-200 text-gray-700'
              }`}
            >
              <span className="sm:inline">Zeitraum</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Card className="p-4 bg-white border-gray-200 shadow-sm flex flex-wrap gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Von</label>
                  <input
                    type="date"
                    className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Bis</label>
                  <input
                    type="date"
                    className="block w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDateRange({ start: '', end: '' })}
                  className="text-gray-400 hover:text-danger h-[38px] flex items-center"
                  disabled={!dateRange.start && !dateRange.end}
                >
                  <XIcon className="w-4 h-4 mr-1" />
                  <span className="leading-none h-5 flex items-center">Filter zurücksetzen</span>
                </Button>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* <div className="flex justify-between items-center">
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
      </div> */}

      {/* {dipError && (
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
      )} */}

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
          <div className="flex flex-col gap-6">
            {[...Array(4)].map((_, i) => (
              <VoteCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredMeasures && filteredMeasures.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6"
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
