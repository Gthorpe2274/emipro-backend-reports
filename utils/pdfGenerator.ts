// This file leverages global objects 'jspdf' and 'html2canvas' loaded from CDN
// We declare them here to satisfy TypeScript's static analysis.
declare const jspdf: any;
declare const html2canvas: any;

export const generatePdf = async (elementId: string, fileName: string): Promise<void> => {
  const reportElement = document.getElementById(elementId);
  if (!reportElement) {
    console.error('Element not found for PDF generation');
    return;
  }

  // Use html2canvas to capture the element
  const canvas = await html2canvas(reportElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true, 
  });

  const imgData = canvas.toDataURL('image/png');

  // Initialize jsPDF
  const { jsPDF } = jspdf;
  const pdf = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;
  const ratio = canvasWidth / canvasHeight;

  const imgWidth = pdfWidth;
  const imgHeight = imgWidth / ratio;

  let heightLeft = imgHeight;
  let position = 0;
  
  // Add front page
  pdf.setFontSize(30);
  pdf.text('Emigration Pro Report', pdfWidth / 2, pdfHeight / 3, { align: 'center' });
  pdf.setFontSize(16);
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pdfWidth / 2, pdfHeight / 3 + 20, { align: 'center' });
  pdf.addPage();
  
  // Create Table of Contents
  pdf.setFontSize(22);
  pdf.text('Table of Contents', 14, 22);
  pdf.setFontSize(12);
  let tocY = 40;

  // Use a more specific selector to only get section titles
  const sectionElements = reportElement.querySelectorAll<HTMLHeadingElement>('[id^="section-"] h2');
  sectionElements.forEach((header, index) => {
    if (header.textContent) {
      pdf.text(`${index + 1}. ${header.textContent}`, 14, tocY);
      tocY += 10;
    }
  });
  
  // Add the report content
  pdf.addPage();
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  while (heightLeft > 0) {
    position = -heightLeft;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }
  
  pdf.save(fileName);
};