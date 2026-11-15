import { useState } from 'react';
import type { RepairRequest } from '@/features/vehicles';
import { InstallationStep } from './InstallationStep';
import { RemovalStep } from './RemovalStep';

interface ReplaceFixProps {
  request: RepairRequest;
  onFinished: () => void;
}

/** ② for a broken part: the old one comes off, then a new one goes in. */
export function ReplaceFix({ request, onFinished }: ReplaceFixProps) {
  const [isRemoved, setIsRemoved] = useState(false);

  return isRemoved ? (
    <InstallationStep request={request} onFinished={onFinished} />
  ) : (
    <RemovalStep request={request} onFinished={() => setIsRemoved(true)} />
  );
}
