import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Clock, Pause, Play } from 'lucide-react';
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
  const [isPaused, setIsPaused] = useState(false);

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
    if (news.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [news.length, isPaused]);

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
    <div className="relative group w-full bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl shadow-xl overflow-hidden mb-10 border border-blue-400/20">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="p-6 sm:p-10 relative z-10">
        <div className="flex items-center gap-2 mb-6 text-blue-100/80">
          <div className="h-1 w-8 bg-blue-300 rounded-full"></div>
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Aktuelle Nachrichten</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-5"
          >
            <div className="flex flex-wrap items-center gap-3">
              {currentItem.category?.map((cat, i) => (
                <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black rounded-lg uppercase tracking-wider border border-white/10">
                  {cat}
                </span>
              ))}
              <div className="flex items-center text-blue-100/70 text-xs gap-1.5 ml-auto sm:ml-0">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-medium">{new Date(currentItem.pubDate).toLocaleDateString('de-DE', { 
                  day: '2-digit', 
                  month: 'long'
                })}</span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
              {currentItem.title}
            </h3>

            <p className="text-blue-50/90 line-clamp-2 text-sm sm:text-lg leading-relaxed font-medium">
              {currentItem.description.replace(/<[^>]*>?/gm, '')}
            </p>

            <div className="pt-2">
              <a
                href={currentItem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 rounded-xl font-bold text-sm transition-all hover:bg-blue-50 hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20 group/link"
              >
                Vollständigen Artikel lesen
                <ExternalLink className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute right-6 bottom-6 flex items-center gap-3 z-20">
        <button
          onClick={() => setIsPaused(!isPaused)}
          className={`p-2.5 rounded-xl backdrop-blur-md border transition-all active:scale-90 ${
            isPaused 
              ? 'bg-white text-blue-700 border-white shadow-lg' 
              : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
          }`}
          aria-label={isPaused ? "Slider fortsetzen" : "Slider pausieren"}
          title={isPaused ? "Fortsetzen" : "Pausieren"}
        >
          {isPaused ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
        </button>

        <div className="h-8 w-px bg-white/20 mx-1"></div>

        <button
          onClick={prevSlide}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition-all active:scale-90"
          aria-label="Vorherige News"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex gap-2 px-1">
          {news.slice(0, 5).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentIndex ? 'w-8 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition-all active:scale-90"
          aria-label="Nächste News"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default NewsSlider;
