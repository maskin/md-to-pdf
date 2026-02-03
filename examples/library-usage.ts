/**
 * Example: Using md-to-pdf as a library
 */

import { markdownToPdf } from '../src/lib';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function example() {
  console.log('Example: Converting Markdown to PDF using the library\n');

  // Example 1: Simple conversion
  console.log('1. Simple conversion:');
  const markdown1 = `# Hello World

This is a simple markdown document.

- Feature 1
- Feature 2
- Feature 3
`;

  const pdfBuffer1 = await markdownToPdf(markdown1);
  const output1 = join('/tmp', 'simple-output.pdf');
  writeFileSync(output1, pdfBuffer1);
  console.log(`   ✓ PDF created: ${output1}`);

  // Example 2: Conversion with custom options
  console.log('\n2. Conversion with custom options (A5, landscape):');
  const markdown2 = `# Custom Format

This document uses A5 paper size in landscape mode.

**Bold text** and *italic text* are supported.
`;

  const pdfBuffer2 = await markdownToPdf(markdown2, {
    format: 'A5',
    landscape: true,
    margin: {
      top: '10mm',
      bottom: '10mm',
      left: '10mm',
      right: '10mm'
    }
  });
  const output2 = join('/tmp', 'custom-format.pdf');
  writeFileSync(output2, pdfBuffer2);
  console.log(`   ✓ PDF created: ${output2}`);

  // Example 3: Conversion with custom CSS
  console.log('\n3. Conversion with custom CSS:');
  const markdown3 = `# Styled Document

This document has custom styling applied.

## Subtitle

Paragraph with normal text.
`;

  const customCss = `
    body { 
      background-color: #f9f9f9; 
    }
    h1 { 
      color: #2c3e50; 
      border-bottom: 3px solid #3498db; 
    }
    h2 { 
      color: #e74c3c; 
    }
  `;

  const pdfBuffer3 = await markdownToPdf(markdown3, {
    css: customCss,
    printBackground: true
  });
  const output3 = join('/tmp', 'styled-output.pdf');
  writeFileSync(output3, pdfBuffer3);
  console.log(`   ✓ PDF created: ${output3}`);

  console.log('\n✨ All examples completed successfully!');
}

example().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
