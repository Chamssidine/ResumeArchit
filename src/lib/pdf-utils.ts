
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPdf = async (elementId: string, fileName: string = 'resume.pdf'): Promise<void> => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Element with ID "${elementId}" not found.`);
    throw new Error('Preview element not found for PDF export.');
  }

  // Store original styles to restore later
  const originalStyles = {
    width: input.style.width,
    height: input.style.height,
    transform: input.style.transform,
    transformOrigin: input.style.transformOrigin,
    position: input.style.position, // Added to store/restore
    top: input.style.top,           // Added to store/restore
    left: input.style.left,         // Added to store/restore
    boxShadow: input.style.boxShadow,
    margin: input.style.margin,
    padding: input.style.padding, 
  };

  // Apply temporary styles for high-quality capture
  const captureWidth = 1000; // Use a fixed width for rendering, e.g. 1000px for good detail
  const qualityScale = 2;    // Scale for html2canvas to improve resolution

  // Temporarily override certain styles for cleaner capture
  input.style.width = `${captureWidth}px`;
  input.style.height = 'auto'; // Let height adjust to content
  input.style.transform = 'none'; 
  input.style.transformOrigin = 'initial';
  input.style.boxShadow = 'none'; // Remove shadow for capture
  input.style.margin = '0 auto'; // Center the element for consistent capture if it was centered before
  // Original padding is maintained as it's part of the design being captured

  // Ensure all images are loaded
  const images = Array.from(input.getElementsByTagName('img'));
  await Promise.all(images.map(img => {
    if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
    return new Promise(resolve => {
      img.onload = resolve;
      img.onerror = () => {
        console.warn(`Image failed to load: ${img.src}`);
        resolve(null); // Resolve even if an image fails, to not block PDF generation
      };
    });
  }));

  // Wait for fonts to be ready
  try {
    await document.fonts.ready;
  } catch (fontError) {
    console.warn("Error waiting for document.fonts.ready (proceeding anyway):", fontError);
  }
  
  // Additional delay to ensure all styles and web fonts are applied and rendered
  await new Promise(resolve => setTimeout(resolve, 1000)); // Increased delay

  try {
    const canvas = await html2canvas(input, {
      scale: qualityScale,
      useCORS: true,
      logging: false, 
      width: input.scrollWidth, 
      height: input.scrollHeight,
      windowWidth: input.scrollWidth,
      windowHeight: input.scrollHeight,
      backgroundColor: '#ffffff', // Explicit white background for the canvas
      removeContainer: true, 
    });

    const imgData = canvas.toDataURL('image/png', 0.95); // Use high quality PNG
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidthMm = pdf.internal.pageSize.getWidth();
    const pdfHeightMm = pdf.internal.pageSize.getHeight();
    const canvasAspectRatio = canvas.width / canvas.height;
    
    let imgPdfWidthMm = pdfWidthMm;
    let imgPdfHeightMm = pdfWidthMm / canvasAspectRatio;

    if (imgPdfHeightMm > pdfHeightMm) {
      imgPdfHeightMm = pdfHeightMm;
      imgPdfWidthMm = pdfHeightMm * canvasAspectRatio;
    }
    
    const xOffset = (pdfWidthMm - imgPdfWidthMm) / 2;
    const yOffset = (pdfHeightMm - imgPdfHeightMm) / 2;
    
    pdf.addImage(imgData, 'PNG', xOffset > 0 ? xOffset : 0, yOffset > 0 ? yOffset : 0, imgPdfWidthMm, imgPdfHeightMm);
    pdf.save(fileName);

  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error('Failed to generate PDF. Please check the console for more details.');
  } finally {
    // Restore all original styles
    input.style.width = originalStyles.width;
    input.style.height = originalStyles.height;
    input.style.transform = originalStyles.transform;
    input.style.transformOrigin = originalStyles.transformOrigin;
    input.style.position = originalStyles.position;
    input.style.top = originalStyles.top;
    input.style.left = originalStyles.left;
    input.style.boxShadow = originalStyles.boxShadow;
    input.style.margin = originalStyles.margin;
    input.style.padding = originalStyles.padding;
  }
};
