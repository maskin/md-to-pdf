import { markdownToPdf } from '../lib/converter';

describe('markdownToPdf', () => {
  it('should convert simple markdown to PDF buffer', async () => {
    const markdown = '# Hello World\n\nThis is a test.';
    const pdfBuffer = await markdownToPdf(markdown);
    
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(0);
    
    // Check PDF signature
    const pdfHeader = pdfBuffer.slice(0, 4).toString();
    expect(pdfHeader).toBe('%PDF');
  }, 30000);
  
  it('should convert markdown with various elements', async () => {
    const markdown = `
# Main Title

## Subtitle

This is a paragraph with **bold** and *italic* text.

- List item 1
- List item 2
- List item 3

\`\`\`javascript
console.log('Hello');
\`\`\`

> This is a blockquote
`;
    
    const pdfBuffer = await markdownToPdf(markdown);
    
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(0);
  }, 30000);
  
  it('should accept custom PDF options', async () => {
    const markdown = '# Test Document';
    const pdfBuffer = await markdownToPdf(markdown, {
      format: 'Letter',
      landscape: true,
      margin: {
        top: '10mm',
        bottom: '10mm',
        left: '10mm',
        right: '10mm'
      }
    });
    
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(0);
  }, 30000);
  
  it('should apply custom CSS', async () => {
    const markdown = '# Styled Document';
    const customCss = 'h1 { color: red; }';
    
    const pdfBuffer = await markdownToPdf(markdown, { css: customCss });
    
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(0);
  }, 30000);
});
