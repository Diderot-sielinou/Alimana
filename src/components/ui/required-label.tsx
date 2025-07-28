// components/ui/required-label.tsx
import { Label } from '@/components/ui/label';
import { LabelProps } from '@radix-ui/react-label';
import { Asterisk } from 'lucide-react';

interface RequiredLabelProps extends LabelProps {
  required?: boolean;
}

export function RequiredLabel({ children, required = true, ...props }: RequiredLabelProps) {
  return (
    <Label {...props} className="flex items-center gap-2">
      {children}
      {required && <Asterisk className="h-3 w-3 text-red-500" />}
    </Label>
  );
}
