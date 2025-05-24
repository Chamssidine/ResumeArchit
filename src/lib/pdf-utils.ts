
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
    position: input.style.position,
    top: input.style.top,
    left: input.style.left,
    boxShadow: input.style.boxShadow,
    margin: input.style.margin,
    padding: input.style.padding,
    // Potentially other styles if modified, e.g., overflow
  };

  // Apply temporary styles for high-quality capture
  const captureWidth = 1050; // A4 width at ~120DPI (A4 is ~8.27 inches, 8.27*120=~992, round up for padding)
  const qualityScale = 2;    // Scale for html2canvas to improve resolution (effectively 240 DPI)

  input.style.width = `${captureWidth}px`;
  input.style.height = 'auto'; // Let height adjust to content
  input.style.transform = 'none';
  input.style.transformOrigin = 'initial';
  input.style.boxShadow = 'none'; // Remove shadow for capture
  input.style.margin = '0';    // Remove external margins for capture consistency
  input.style.padding = getComputedStyle(input).padding; // Retain existing padding from classes

  // Ensure all images are loaded
  const images = Array.from(input.getElementsByTagName('img'));
  await Promise.all(images.map(img => {
    if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
    return new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => {
        console.warn(`Image failed to load for PDF: ${img.src}`);
        resolve(null); // Resolve anyway to not block PDF generation entirely
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
  // This happens after fonts.ready and image loading
  await new Promise(resolve => setTimeout(resolve, 1500)); // Slightly increased delay

  // Force a reflow to apply styles before getting scroll dimensions
  // Reading an offset property forces the browser to synchronously calculate layout
  input.offsetHeight; 

  try {
    const canvas = await html2canvas(input, {
      scale: qualityScale,
      useCORS: true, // Attempt to load cross-origin images
      logging: false, // Set to true for debugging html2canvas issues
      scrollX: 0,     // Capture from the top-left
      scrollY: 0,
      width: input.scrollWidth,     // Use the element's full scroll width for capture
      height: input.scrollHeight,   // Use the element's full scroll height
      windowWidth: input.scrollWidth, // Tell html2canvas the "viewport" width is the element's width
      windowHeight: input.scrollHeight, // Tell html2canvas the "viewport" height is the element's height
      backgroundColor: '#ffffff', // Explicit white background for the canvas
      removeContainer: true, // Remove the cloned DOM from the document body after capture
    });

    const imgData = canvas.toDataURL('image/png', 1.0); // Use high quality PNG (quality param mostly for JPG)
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true, // Enable compression
    });

    const pdfWidthMm = pdf.internal.pageSize.getWidth();
    const pdfHeightMm = pdf.internal.pageSize.getHeight();
    
    // Calculate image dimensions to fit A4, maintaining aspect ratio
    const canvasAspectRatio = canvas.width / canvas.height;
    let imgPdfWidthMm = pdfWidthMm;
    let imgPdfHeightMm = pdfWidthMm / canvasAspectRatio;

    // If the calculated height is greater than PDF page height, scale by height instead
    if (imgPdfHeightMm > pdfHeightMm) {
      imgPdfHeightMm = pdfHeightMm;
      imgPdfWidthMm = pdfHeightMm * canvasAspectRatio;
    }
    
    // Center the image on the PDF page
    const xOffset = (pdfWidthMm - imgPdfWidthMm) / 2;
    const yOffset = (pdfHeightMm - imgPdfHeightMm) / 2;
    
    // Add the image to the PDF, ensuring it doesn't go off-page if centering results in negative offset (unlikely here but good practice)
    pdf.addImage(imgData, 'PNG', xOffset > 0 ? xOffset : 0, yOffset > 0 ? yOffset : 0, imgPdfWidthMm, imgPdfHeightMm);
    pdf.save(fileName);

  } catch (error) {
    console.error("Error generating PDF with html2canvas:", error);
    throw new Error('Failed to generate PDF. Please check the console for more details.');
  } finally {
    // Restore all original styles
    Object.assign(input.style, originalStyles);
  }
};
