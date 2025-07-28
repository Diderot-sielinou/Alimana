// src/components/common/LoadingSpinner.tsx
import React from 'react';
import { Loader2 } from 'lucide-react'; // Importer l'icône de chargement de Lucide React
import { cva, type VariantProps } from 'class-variance-authority'; // Pour gérer les variantes de taille
import { cn } from '@/lib/utils'; // Pour fusionner les classes Tailwind

// Définir les variantes de taille pour le spinner
const spinnerVariants = cva(
  'animate-spin text-primary', // Classes de base: animation de rotation et couleur primaire
  {
    variants: {
      size: {
        sm: 'h-4 w-4',   // Petite taille
        md: 'h-6 w-6',   // Taille moyenne (par défaut)
        lg: 'h-8 w-8',   // Grande taille
        xl: 'h-12 w-12', // Très grande taille
      },
    },
    defaultVariants: {
      size: 'md', // Taille par défaut si non spécifiée
    },
  }
);

// Définir les props du composant LoadingSpinner
export type LoadingSpinnerProps = VariantProps<typeof spinnerVariants>

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size }) => {
  return (
    <Loader2 className={cn(spinnerVariants({ size }))} />
  );
};