import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppShell } from './components/AppShell';
import { Dashboard } from './pages/Dashboard';
import { MeasureDetail } from './pages/MeasureDetail';
import { About } from './pages/About';
import { Impressum } from './pages/Impressum';
import { Datenschutz } from './pages/Datenschutz';
import { initializeStorage } from './mock/api';
import Conferences from './components/Conferences';
import NewsSlider from './components/NewsSlider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

initializeStorage();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/news" element={<NewsSlider />} />
            <Route path="/conferences" element={<Conferences />} />
            <Route path="/measure/:id" element={<MeasureDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
