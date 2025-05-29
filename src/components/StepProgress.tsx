
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: number;
}

const StepProgress = ({ steps, currentStep }: StepProgressProps) => {
  return (
    <div className="relative">
      {/* Progress Line */}
      <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 dark:bg-gray-700">
        <motion.div
          className="h-full bg-gray-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <motion.div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors relative z-10 ${
                step.id < currentStep
                  ? 'bg-gray-500 border-gray-500 text-white'
                  : step.id === currentStep
                  ? 'bg-white dark:bg-gray-800 border-gray-500 text-gray-500'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {step.id < currentStep ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Check className="h-6 w-6" />
                </motion.div>
              ) : (
                <span className="font-medium">{step.id}</span>
              )}
            </motion.div>
            
            <div className="mt-3 text-center max-w-24">
              <p className={`text-sm font-medium ${
                step.id <= currentStep 
                  ? 'text-gray-900 dark:text-white' 
                  : 'text-gray-400 dark:text-gray-500'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepProgress;
