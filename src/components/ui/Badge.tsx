import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'primary';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';

  const variantClasses = {
    default: 'bg-gray-200 text-gray-700',
    success: 'bg-success/10 text-success',
    danger: 'bg-danger/10 text-danger',
    warning: 'bg-warning/10 text-gray-800',
    primary: 'bg-primary/10 text-primary',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
}
