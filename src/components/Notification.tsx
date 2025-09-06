import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  onDismiss: () => void;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  onDismiss,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [onDismiss, duration]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500/90 text-white border-green-600';
      case 'error':
        return 'bg-red-500/90 text-white border-red-600';
      case 'warning':
        return 'bg-yellow-500/90 text-white border-yellow-600';
      case 'info':
      default:
        return 'bg-blue-500/90 text-white border-blue-600';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-right-full duration-300">
      <div className={`${getTypeStyles()} rounded-lg border p-4 shadow-lg max-w-sm`}>
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium pr-2">{message}</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
