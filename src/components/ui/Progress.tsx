interface ProgressProps {
  value: number;
  max: number;
  variant?: 'default' | 'success' | 'danger';
  className?: string;
}

export function Progress({ value, max, variant = 'default', className = '' }: ProgressProps) {
  const percentage = Math.min(100, (value / max) * 100);

  const variantClasses = {
    default: 'bg-primary',
    success: 'bg-success',
    danger: 'bg-danger',
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className={`h-full transition-all duration-500 ${variantClasses[variant]}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
