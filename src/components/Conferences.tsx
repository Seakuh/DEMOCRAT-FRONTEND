import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

interface Diskussionspunkt {
  startzeit: string;
  endzeit: string;
  status: string;
  titel: string;
  articleId?: string;
  top?: string;
}

interface Tagesordnung {
  date: string;
  active: 0 | 1;
  sitzungsnummer: number;
  name: string;
  diskussionspunkte: Diskussionspunkt[];
}

interface TagesordnungenData {
  tagesordnungen: Tagesordnung[];
}

const formatTime = (timestamp: string): string => {
  if (!timestamp || timestamp.length < 12) return '';
  // Format: YYYYMMDDhhmmss -> hh:mm
  const hours = timestamp.substring(8, 10);
  const minutes = timestamp.substring(10, 12);
  return `${hours}:${minutes}`;
};

const getArticleUrl = (articleId: string | undefined): string | null => {
  if (!articleId || articleId.trim() === '') return null;
  return `https://www.bundestag.de/dokumente/textarchiv/${articleId}`;
};

const Conferences: React.FC = () => {
  const [data, setData] = useState<TagesordnungenData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const [nextSessionIndex, setNextSessionIndex] = useState<number | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/api/drucksachen/conferences', {
          signal: abortController.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonData = await response.json();
        const parsedTagesordnungen: Tagesordnung[] = jsonData.tagesordnungen.map((to: any) => ({
          date: to.date || '',
          active: to.active as 0 | 1,
          sitzungsnummer: to.sitzungsnummer || 0,
          name: to.name || '',
          diskussionspunkte: (to.diskussionspunkte || []).map((dp: any) => ({
            startzeit: dp.startzeit || '',
            endzeit: dp.endzeit || '',
            status: dp.status || '',
            titel: dp.titel || '',
            articleId: dp.articleId || undefined,
            top: dp.top || undefined,
          })).sort((a: Diskussionspunkt, b: Diskussionspunkt) => a.startzeit.localeCompare(b.startzeit)),
        }));

        // Sort tagesordnungen by date descending (newest first)
        parsedTagesordnungen.sort((a, b) => {
          const dateA = a.date.split('.').reverse().join('');
          const dateB = b.date.split('.').reverse().join('');
          return dateB.localeCompare(dateA);
        });

        setData({ tagesordnungen: parsedTagesordnungen });
        
        // Find and highlight/open the next session
        // In a descending list, the "next" session is the one with the smallest date >= now
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        // Filter sessions that are today or in the future
        const futureSessions = parsedTagesordnungen
          .map((to, idx) => ({ to, idx }))
          .filter(item => {
            const [day, month, year] = item.to.date.split('.').map(Number);
            const sessionDate = new Date(year, month - 1, day);
            return sessionDate >= now;
          });

        // The "next" session is the one among future sessions with the earliest date
        // Since the list is descending, it's the LAST one in the futureSessions array
        if (futureSessions.length > 0) {
          const nextItem = futureSessions[futureSessions.length - 1];
          setNextSessionIndex(nextItem.idx);
          setOpenAccordion(nextItem.idx);
        }

        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError('Fehler beim Laden der Konferenzdaten. Bitte versuchen Sie es später erneut.');
        console.error('Error fetching XML:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, []);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Lade Sitzungstermine...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!data || data.tagesordnungen.length === 0) {
    return <p className="text-gray-500 italic">Keine aktuellen Sitzungstermine verfügbar.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Aktuelle Tagesordnungen des Bundestages</h3>
      {data.tagesordnungen.map((to, index) => {
        const isNextSession = index === nextSessionIndex;
        return (
          <div 
            key={`${to.date}-${to.sitzungsnummer}`} 
            className={`border rounded-lg overflow-hidden transition-all duration-500 ${
              isNextSession 
                ? 'border-red-200 shadow-[0_0_15px_rgba(239,68,68,0.1)] ring-1 ring-red-100' 
                : 'border-gray-200'
            }`}
          >
            <button
              onClick={() => toggleAccordion(index)}
              className={`w-full flex items-center justify-between p-4 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isNextSession ? 'bg-red-50/30 hover:bg-red-50/50' : 'bg-gray-50 hover:bg-gray-100'
              }`}
              aria-expanded={openAccordion === index}
              aria-controls={`accordion-content-${index}`}
              id={`accordion-button-${index}`}
            >
              <div className="flex flex-col items-start text-left">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{to.name}</span>
                  {isNextSession && (
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                      <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Nächste</span>
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-600">
                  Sitzung Nr. {to.sitzungsnummer} • {to.date}
                </span>
              </div>
              {openAccordion === index ? (
                <ChevronUp className={`h-5 w-5 ${isNextSession ? 'text-red-400' : 'text-gray-500'}`} />
              ) : (
                <ChevronDown className={`h-5 w-5 ${isNextSession ? 'text-red-400' : 'text-gray-500'}`} />
              )}
            </button>

          <div
            id={`accordion-content-${index}`}
            role="region"
            aria-labelledby={`accordion-button-${index}`}
            className={`${openAccordion === index ? 'block' : 'hidden'} border-t border-gray-200 bg-white overflow-x-auto`}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zeit</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TOP</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titel</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {to.diskussionspunkte.map((dp, dpIndex) => {
                  const url = getArticleUrl(dp.articleId);
                  return (
                    <tr key={dpIndex} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 font-mono">
                        {formatTime(dp.startzeit)} - {formatTime(dp.endzeit)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          dp.status === 'Beendet' ? 'bg-gray-100 text-gray-800' : 
                          dp.status === 'Laufend' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {dp.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {dp.top || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex items-start gap-2">
                          <span className="flex-grow">{dp.titel}</span>
                          {url ? (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 shrink-0"
                              title="Details im Bundestags-Archiv"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          ) : dp.articleId ? (
                            <span className="text-xs text-gray-400 shrink-0">ID: {dp.articleId}</span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    })}
    </div>
  );
};

export default Conferences;
