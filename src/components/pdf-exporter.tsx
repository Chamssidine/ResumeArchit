'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { LoadingSpinner } from './loading-spinner';

export interface PdfExporterProps {
  onExport: () => Promise<void>;
  isExporting: boolean;
}

export function PdfExporter({ onExport, isExporting }: PdfExporterProps) {
  return (
    <Button onClick={onExport} disabled={isExporting} className="min-w-[150px]">
      {isExporting ? (
        <LoadingSpinner size={16} className="mr-2" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isExporting ? 'Exporting...' : 'Export as PDF'}
    </Button>
  );
}
