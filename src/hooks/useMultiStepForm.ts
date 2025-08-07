import { useState, useCallback } from 'react';

export interface UseMultiStepFormProps {
  totalSteps: number;
  initialStep?: number;
}

export interface UseMultiStepFormReturn {
  currentStep: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
  progress: number;
}

export const useMultiStepForm = ({ 
  totalSteps, 
  initialStep = 0 
}: UseMultiStepFormProps): UseMultiStepFormReturn => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  const reset = useCallback(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return {
    currentStep,
    isFirstStep,
    isLastStep,
    nextStep,
    previousStep,
    goToStep,
    reset,
    progress
  };
};
