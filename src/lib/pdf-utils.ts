
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPdf = async (elementId: string, fileName: string = 'resume.pdf'): Promise<void> => {
  const input = document.getElementById(elementId);
  if (!input) {
    console.error(`Element with ID "${elementId}" not found.`);
    throw new Error('Preview element not found for PDF export.');
  }

  // Store original inline styles to restore later
  const originalInlineStyles = {
    height: input.style.height,
    transform: input.style.transform,
    transformOrigin: input.style.transformOrigin,
    boxShadow: input.style.boxShadow,
    margin: input.style.margin,
    padding: input.style.padding, 
    // Note: We are not changing width or max-width via inline styles here,
    // relying on the element's classes (e.g., max-w-[210mm]).
  };

  const qualityScale = 2; // Scale for html2canvas to improve resolution

  // Apply temporary styles for high-quality capture
  // Let the element's intrinsic width (e.g., max-w-[210mm] from Tailwind) define its capture size.
  input.style.height = 'auto'; // Let height adjust to content
  input.style.transform = 'none';
  input.style.transformOrigin = 'initial';
  input.style.boxShadow = 'none'; // Remove shadow for capture
  input.style.margin = '0 auto';    // Center the element if it's narrower than a hypothetical parent, good for consistency
                                  // but given html2canvas captures the element itself, '0' might be safer.
                                  // Let's use '0' to avoid unexpected centering issues within the canvas.
  input.style.margin = '0';


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
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Force a reflow to apply styles before getting scroll dimensions
  // Reading an offset property forces the browser to synchronously calculate layout
  input.offsetHeight; 

  try {
    // At this point, input.scrollWidth and input.scrollHeight should reflect the element's
    // true dimensions based on its content and CSS (like max-w-[210mm]).
    const currentScrollWidth = input.scrollWidth;
    const currentScrollHeight = input.scrollHeight;

    const canvas = await html2canvas(input, {
      scale: qualityScale,
      useCORS: true,
      logging: false, // Set to true for debugging html2canvas issues
      scrollX: 0,     // Capture from the element's own top-left
      scrollY: 0,
      width: currentScrollWidth,     // Use the element's full scroll width for capture
      height: currentScrollHeight,   // Use the element's full scroll height
      windowWidth: currentScrollWidth, // Tell html2canvas the "viewport" width is the element's width
      windowHeight: currentScrollHeight, // Tell html2canvas the "viewport" height is the element's height
      backgroundColor: '#ffffff', // Explicit white background for the canvas
      removeContainer: true, // Remove the cloned DOM from the document body after capture
    });

    const imgData = canvas.toDataURL('image/png', 1.0); // Use high quality PNG
    
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
    // This ensures the entire captured content fits onto one PDF page, scaled down if necessary.
    if (imgPdfHeightMm > pdfHeightMm) {
      imgPdfHeightMm = pdfHeightMm;
      imgPdfWidthMm = pdfHeightMm * canvasAspectRatio;
    }
    
    // Center the image on the PDF page
    const xOffset = (pdfWidthMm - imgPdfWidthMm) / 2;
    const yOffset = (pdfHeightMm - imgPdfHeightMm) / 2;
    
    pdf.addImage(imgData, 'PNG', Math.max(0, xOffset), Math.max(0, yOffset), imgPdfWidthMm, imgPdfHeightMm);
    pdf.save(fileName);

  } catch (error) {
    console.error("Error generating PDF with html2canvas:", error);
    throw new Error('Failed to generate PDF. Please check the console for more details.');
  } finally {
    // Restore original inline styles
    input.style.height = originalInlineStyles.height;
    input.style.transform = originalInlineStyles.transform;
    input.style.transformOrigin = originalInlineStyles.transformOrigin;
    input.style.boxShadow = originalInlineStyles.boxShadow;
    input.style.margin = originalInlineStyles.margin;
    input.style.padding = originalInlineStyles.padding;

    // If styles were originally set by classes (i.e., originalInlineStyles.property was null/empty),
    // setting them back to null/empty effectively removes the inline style, letting classes take over.
    // For example, if `input.style.boxShadow` was empty, originalInlineStyles.boxShadow is empty,
    // so `input.style.boxShadow = ''` which is correct.
  }
};
