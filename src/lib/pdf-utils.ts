import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPdf = async (elementId: string, fileName: string = 'resume.pdf'): Promise<void> => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Element with ID "${elementId}" not found.`);
    throw new Error('Preview element not found for PDF export.');
  }

  // Temporarily increase resolution for better PDF quality
  const originalWidth = input.style.width;
  const originalHeight = input.style.height;
  const originalTransform = input.style.transform;
  
  // A4 dimensions in pixels at 96 DPI: 794x1123. Use this as a base aspect ratio.
  const a4WidthPx = 794; 
  const scale = 2; // Increase scale for better quality

  input.style.width = `${a4WidthPx}px`; 
  // Calculate height based on content to maintain aspect ratio / prevent cropping
  // We'll let html2canvas determine height based on content width
  input.style.height = 'auto'; 
  input.style.transform = `scale(${scale})`;
  input.style.transformOrigin = 'top left';
  
  // Ensure all images are loaded
  const images = Array.from(input.getElementsByTagName('img'));
  await Promise.all(images.map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(resolve => {
      img.onload = img.onerror = resolve;
    });
  }));
  
  // Delay to ensure styles are applied, especially for fonts
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    const canvas = await html2canvas(input, {
      scale: scale, // Use the same scale for canvas rendering
      useCORS: true,
      logging: false,
      width: input.scrollWidth, // Use scrollWidth to capture full content width
      height: input.scrollHeight, // Use scrollHeight to capture full content height
      windowWidth: input.scrollWidth,
      windowHeight: input.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // A4 dimensions in points (jsPDF default unit)
    const pdfWidth = 210; // mm
    const pdfHeight = 297; // mm

    const canvasAspectRatio = canvas.width / canvas.height;
    let imgPdfWidth = pdfWidth;
    let imgPdfHeight = pdfWidth / canvasAspectRatio;

    if (imgPdfHeight > pdfHeight) {
        imgPdfHeight = pdfHeight;
        imgPdfWidth = pdfHeight * canvasAspectRatio;
    }
    
    const pdf = new jsPDF({
      orientation: imgPdfWidth > imgPdfHeight ? 'landscape' : 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const xOffset = (pdf.internal.pageSize.getWidth() - imgPdfWidth) / 2;
    const yOffset = (pdf.internal.pageSize.getHeight() - imgPdfHeight) / 2;
    
    pdf.addImage(imgData, 'PNG', xOffset > 0 ? xOffset : 0, yOffset > 0 ? yOffset : 0, imgPdfWidth, imgPdfHeight);
    pdf.save(fileName);

  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error('Failed to generate PDF.');
  } finally {
    // Restore original styles
    input.style.width = originalWidth;
    input.style.height = originalHeight;
    input.style.transform = originalTransform;
    input.style.transformOrigin = 'initial';
  }
};
