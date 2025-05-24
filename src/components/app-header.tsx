import { Logo } from '@/components/icons/logo';
import type { PdfExporterProps } from '@/components/pdf-exporter';

interface AppHeaderProps {
  onExportPdf: PdfExporterProps['onExport'];
  isExporting: PdfExporterProps['isExporting'];
}

export function AppHeader({ onExportPdf, isExporting }: AppHeaderProps) {
  // PdfExporter component is now directly used in page.tsx for simplicity.
  // This header is simplified.
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo className="h-8 w-auto" />
        {/* PDF Exporter button will be placed in the main layout controls */}
      </div>
    </header>
  );
}
