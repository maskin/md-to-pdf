import express, { Request, Response } from 'express';
import { markdownToPdf, PdfOptions } from '../lib';

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.text({ type: 'text/markdown', limit: '10mb' }));

/**
 * Health check endpoint
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'md-to-pdf' });
});

/**
 * Convert markdown to PDF
 * POST /convert
 * Body: { markdown: string, options?: PdfOptions }
 */
app.post('/convert', async (req: Request, res: Response) => {
  try {
    const { markdown, options } = req.body;
    
    if (!markdown) {
      return res.status(400).json({ error: 'Markdown content is required' });
    }
    
    // Validate options
    const pdfOptions: PdfOptions = {
      format: options?.format || 'A4',
      margin: options?.margin || {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      },
      printBackground: options?.printBackground !== false,
      landscape: options?.landscape || false,
      css: options?.css
    };
    
    // Convert to PDF
    const pdfBuffer = await markdownToPdf(markdown, pdfOptions);
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error converting markdown:', error);
    res.status(500).json({ 
      error: 'Failed to convert markdown to PDF',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Convert markdown to PDF (text/markdown content type)
 * POST /convert/simple
 * Body: raw markdown text
 */
app.post('/convert/simple', async (req: Request, res: Response) => {
  try {
    const markdown = typeof req.body === 'string' ? req.body : req.body.toString();
    
    if (!markdown) {
      return res.status(400).json({ error: 'Markdown content is required' });
    }
    
    // Convert to PDF with default options
    const pdfBuffer = await markdownToPdf(markdown);
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send PDF
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error converting markdown:', error);
    res.status(500).json({ 
      error: 'Failed to convert markdown to PDF',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get API information
 */
app.get('/', (req: Request, res: Response) => {
  res.json({
    name: 'Markdown to PDF API',
    version: '1.0.0',
    endpoints: {
      'POST /convert': 'Convert markdown to PDF with options',
      'POST /convert/simple': 'Convert markdown to PDF with default options',
      'GET /health': 'Health check'
    }
  });
});

/**
 * Start the server
 */
export function startServer(port: number = 3000): void {
  app.listen(port, () => {
    console.log(`Markdown to PDF service running on http://localhost:${port}`);
    console.log(`API endpoints:`);
    console.log(`  POST http://localhost:${port}/convert`);
    console.log(`  POST http://localhost:${port}/convert/simple`);
    console.log(`  GET  http://localhost:${port}/health`);
  });
}

// Start server if this file is run directly
if (require.main === module) {
  const port = parseInt(process.env.PORT || '3000', 10);
  startServer(port);
}

export default app;
