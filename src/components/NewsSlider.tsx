import React, { useState, useEffect } from 'react';
import { ExternalLink, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  category: string[];
  guid: string;
}

const NewsSlider: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/api/news');
        if (!response.ok) throw new Error('Fehler beim Laden der News');
        const data = await response.json();
        setNews(data);
      } catch (err) {
        console.error('News Fetch Error:', err);
        setError('News konnten nicht geladen werden.');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-1 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
            <div className="flex-grow space-y-3">
              <div className="flex gap-3">
                <div className="h-3 w-20 bg-gray-100 rounded animate-pulse"></div>
                <div className="h-3 w-16 bg-gray-100 rounded animate-pulse"></div>
              </div>
              <div className="h-5 w-3/4 bg-gray-100 rounded animate-pulse"></div>
              <div className="h-3 w-1/2 bg-gray-50 rounded animate-pulse"></div>
            </div>
            <div className="h-8 w-8 bg-gray-50 rounded-lg animate-pulse shrink-0"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error || news.length === 0) return null;

  return (
    <div className="space-y-6 mb-12">
      <div className="flex items-center gap-3 mb-2">
        <div className="h-1 w-8 bg-blue-600 rounded-full"></div>
        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider">Aktuelle Nachrichten</h2>
      </div>
      
      <div className="flex flex-col gap-4">
        {news.slice(0, 8).map((item) => (
          <motion.div
            key={item.guid}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
          >
            <div className="absolute inset-y-0 left-0 w-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <a 
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col sm:flex-row sm:items-center p-4 sm:p-5 gap-4"
            >
              <div className="flex flex-col gap-2 flex-grow">
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-gray-400 text-[10px] gap-1.5 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(item.pubDate).toLocaleDateString('de-DE', { 
                      day: '2-digit', 
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  {item.category?.slice(0, 1).map((cat, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-black rounded uppercase tracking-wider border border-blue-100">
                      {cat}
                    </span>
                  ))}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight group-hover:text-blue-700 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                
                <p className="text-gray-500 text-xs sm:text-sm line-clamp-1">
                  {item.description.replace(/<[^>]*>?/gm, '')}
                </p>
              </div>

              <div className="flex items-center gap-2 text-blue-600 shrink-0 self-end sm:self-center">
                <span className="text-xs font-bold sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">Lesen</span>
                <ExternalLink className="w-4 h-4" />
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NewsSlider;
