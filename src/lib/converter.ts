import MarkdownIt from 'markdown-it';
import puppeteer, { Browser, Page } from 'puppeteer';

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

/**
 * Options for PDF generation
 */
export interface PdfOptions {
  /**
   * Path to save the PDF file. If not provided, returns buffer.
   */
  output?: string;
  
  /**
   * Paper format (e.g., 'A4', 'Letter')
   */
  format?: 'A4' | 'A3' | 'A5' | 'Letter' | 'Legal' | 'Tabloid';
  
  /**
   * Paper margins
   */
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  
  /**
   * Print background graphics
   */
  printBackground?: boolean;
  
  /**
   * Display header and footer
   */
  displayHeaderFooter?: boolean;
  
  /**
   * HTML template for header
   */
  headerTemplate?: string;
  
  /**
   * HTML template for footer
   */
  footerTemplate?: string;
  
  /**
   * Custom CSS to apply to the markdown content
   */
  css?: string;
  
  /**
   * Landscape mode
   */
  landscape?: boolean;
}

/**
 * Convert markdown text to PDF
 * @param markdown Markdown content as string
 * @param options PDF generation options
 * @returns Buffer containing the PDF data
 */
export async function markdownToPdf(
  markdown: string,
  options: PdfOptions = {}
): Promise<Buffer> {
  let browser: Browser | null = null;
  
  try {
    // Convert markdown to HTML
    const html = md.render(markdown);
    
    // Create full HTML document with styling
    const fullHtml = createHtmlDocument(html, options.css);
    
    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page: Page = await browser.newPage();
    
    // Set content
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: options.format || 'A4',
      margin: options.margin || {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      printBackground: options.printBackground !== false,
      displayHeaderFooter: options.displayHeaderFooter || false,
      headerTemplate: options.headerTemplate || '',
      footerTemplate: options.footerTemplate || '',
      landscape: options.landscape || false,
      path: options.output
    });
    
    return Buffer.from(pdfBuffer);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Create a complete HTML document from markdown HTML
 */
function createHtmlDocument(htmlContent: string, customCss?: string): string {
  const defaultCss = `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #333;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }
    h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 0.3em; }
    h3 { font-size: 1.25em; }
    code {
      background-color: #f6f8fa;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 85%;
    }
    pre {
      background-color: #f6f8fa;
      padding: 16px;
      border-radius: 6px;
      overflow: auto;
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }
    blockquote {
      border-left: 4px solid #dfe2e5;
      padding-left: 16px;
      margin-left: 0;
      color: #6a737d;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 16px 0;
    }
    table th, table td {
      border: 1px solid #dfe2e5;
      padding: 6px 13px;
    }
    table th {
      background-color: #f6f8fa;
      font-weight: 600;
    }
    img {
      max-width: 100%;
    }
    a {
      color: #0366d6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    ul, ol {
      padding-left: 2em;
    }
    hr {
      border: 0;
      border-top: 1px solid #eaecef;
      margin: 24px 0;
    }
  `;
  
  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    ${defaultCss}
    ${customCss || ''}
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>
  `;
}

export default markdownToPdf;
