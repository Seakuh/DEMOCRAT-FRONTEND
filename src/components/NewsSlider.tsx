import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [currentIndex, setCurrentIndex] = useState(0);

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

  // Auto-slide every 8 seconds
  useEffect(() => {
    if (news.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [news.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  if (loading) {
    return (
      <div className="w-full h-48 bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center">
        <span className="text-gray-400">Lade aktuelle Meldungen...</span>
      </div>
    );
  }

  if (error || news.length === 0) return null;

  const currentItem = news[currentIndex];

  return (
    <div className="relative group w-full bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8">
      <div className="p-6 sm:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <div className="flex flex-wrap items-center gap-3">
              {currentItem.category?.map((cat, i) => (
                <span key={i} className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                  {cat}
                </span>
              ))}
              <div className="flex items-center text-gray-400 text-xs gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{new Date(currentItem.pubDate).toLocaleDateString('de-DE', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {currentItem.title}
            </h3>

            <p className="text-gray-600 line-clamp-2 text-sm sm:text-base leading-relaxed">
              {currentItem.description.replace(/<[^>]*>?/gm, '')}
            </p>

            <a
              href={currentItem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline group/link"
            >
              Vollständigen Artikel lesen
              <ExternalLink className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute right-4 bottom-4 flex items-center gap-2">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 transition-colors"
          aria-label="Vorherige News"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-1.5 px-2">
          {news.slice(0, 5).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-gray-200'
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 transition-colors"
          aria-label="Nächste News"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default NewsSlider;
