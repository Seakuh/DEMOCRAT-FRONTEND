import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  const CardComponent = hover ? motion.div : 'div';

  const hoverProps = hover
    ? {
        whileHover: { y: -2 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <CardComponent
      className={`bg-white border border-gray-300 rounded-lg shadow-sm ${className}`}
      {...hoverProps}
    >
      {children}
    </CardComponent>
  );
}
