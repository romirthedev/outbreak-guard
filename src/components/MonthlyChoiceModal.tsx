import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { MonthlyChoiceOption, MonthlyEffect } from '@/hooks/useGameState';

interface MonthlyChoiceModalProps {
  options: MonthlyChoiceOption[];
  onChoiceSelected: (effect: MonthlyEffect) => void;
  open: boolean;
  onClose: () => void;
}

export const MonthlyChoiceModal: React.FC<MonthlyChoiceModalProps> = ({
  options,
  onChoiceSelected,
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Monthly Event</DialogTitle>
          <DialogDescription>
            A new event has occurred. Choose your response wisely.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {options.map((option) => (
            <Button
              key={option.id}
              onClick={() => onChoiceSelected(option.effect)}
              className="w-full"
            >
              {option.text}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};