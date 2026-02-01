import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useSubmitProposal } from '../hooks/useProposals';

const proposalSchema = z.object({
  title: z.string().min(10, 'Titel muss mindestens 10 Zeichen lang sein').max(120, 'Titel darf maximal 120 Zeichen lang sein'),
  summary: z.string().min(50, 'Begründung muss mindestens 50 Zeichen lang sein'),
  category: z.string().min(1, 'Bitte wählen Sie eine Kategorie'),
});

type ProposalForm = z.infer<typeof proposalSchema>;

const categories = [
  'Klima & Energie',
  'Digitales & Verwaltung',
  'Verkehr & Mobilität',
  'Soziales',
  'Bildung',
  'Gesundheit',
  'Wirtschaft',
  'Sonstiges',
];

export function Composer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const submitMutation = useSubmitProposal();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProposalForm>({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      category: '',
    },
  });

  const onSubmit = (data: ProposalForm) => {
    submitMutation.mutate(data, {
      onSuccess: () => {
        reset();
        setIsExpanded(false);
      },
    });
  };

  const handleCancel = () => {
    reset();
    setIsExpanded(false);
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className="cursor-text"
          onClick={() => !isExpanded && setIsExpanded(true)}
        >
          {!isExpanded ? (
            <div className="text-gray-500 py-2">
              Eigenen Gesetzesentwurf einreichen…
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <input
                    type="text"
                    placeholder="Titel des Gesetzentwurfs"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    {...register('title')}
                    autoFocus
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-danger">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <textarea
                    placeholder="Begründung und Beschreibung Ihres Vorschlags..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    {...register('summary')}
                  />
                  {errors.summary && (
                    <p className="mt-1 text-xs text-danger">{errors.summary.message}</p>
                  )}
                </div>

                <div>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    {...register('category')}
                  >
                    <option value="">Kategorie wählen</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-xs text-danger">{errors.category.message}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={submitMutation.isPending}
                  >
                    {submitMutation.isPending ? 'Wird eingereicht...' : 'Einreichen'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={submitMutation.isPending}
                  >
                    Abbrechen
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </form>
    </Card>
  );
}
