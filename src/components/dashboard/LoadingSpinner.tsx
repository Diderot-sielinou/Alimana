// src/components/common/LoadingSpinner.tsx
import React from 'react';
import { Loader2 } from 'lucide-react'; // Import the loading icon from Lucide React
import { cva, type VariantProps } from 'class-variance-authority'; // To handle size variants
import { cn } from '@/lib/utils'; // To merge Tailwind classes

// Define size variants for the spinner
const spinnerVariants = cva(
  'animate-spin text-primary', // Base classes: spin animation and primary color
  {
    variants: {
      size: {
        sm: 'h-4 w-4', // Small size
        md: 'h-6 w-6', // Medium size (default)
        lg: 'h-8 w-8', // Large size
        xl: 'h-12 w-12', // Extra large size
      },
    },
    defaultVariants: {
      size: 'md', // Default size if not specified
    },
  }
);

// Define the props for the LoadingSpinner component
export type LoadingSpinnerProps = VariantProps<typeof spinnerVariants>;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin text-blue-600">
          <Loader2 className={cn(spinnerVariants({ size }))} />
        </div>
        <p className="text-lg font-medium text-gray-700">Loading...</p>
      </div>
    </div>
  );
};
