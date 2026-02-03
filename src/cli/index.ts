#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { markdownToPdf, PdfOptions } from '../lib';

const program = new Command();

program
  .name('md-to-pdf')
  .description('Convert Markdown files to PDF')
  .version('1.0.0')
  .argument('<input>', 'Input markdown file')
  .option('-o, --output <file>', 'Output PDF file path')
  .option('-f, --format <format>', 'Paper format (A4, A3, A5, Letter, Legal, Tabloid)', 'A4')
  .option('--landscape', 'Use landscape orientation', false)
  .option('--no-background', 'Do not print background graphics')
  .option('--margin-top <size>', 'Top margin (e.g., 20mm)', '20mm')
  .option('--margin-right <size>', 'Right margin (e.g., 20mm)', '20mm')
  .option('--margin-bottom <size>', 'Bottom margin (e.g., 20mm)', '20mm')
  .option('--margin-left <size>', 'Left margin (e.g., 20mm)', '20mm')
  .option('--css <file>', 'Custom CSS file to apply')
  .action(async (input: string, options: any) => {
    try {
      // Read input markdown file
      const inputPath = resolve(input);
      if (!existsSync(inputPath)) {
        console.error(`Error: Input file not found: ${inputPath}`);
        process.exit(1);
      }
      
      const markdown = readFileSync(inputPath, 'utf-8');
      
      // Determine output path
      const outputPath = options.output 
        ? resolve(options.output)
        : inputPath.replace(/\.md$/i, '.pdf');
      
      // Read custom CSS if provided
      let customCss: string | undefined;
      if (options.css) {
        const cssPath = resolve(options.css);
        if (!existsSync(cssPath)) {
          console.error(`Error: CSS file not found: ${cssPath}`);
          process.exit(1);
        }
        customCss = readFileSync(cssPath, 'utf-8');
      }
      
      // Prepare PDF options
      const validFormats = ['A4', 'A3', 'A5', 'Letter', 'Legal', 'Tabloid'];
      const format = options.format as string;
      if (!validFormats.includes(format)) {
        console.error(`Error: Invalid format. Must be one of: ${validFormats.join(', ')}`);
        process.exit(1);
      }
      
      const pdfOptions: PdfOptions = {
        output: outputPath,
        format: format as 'A4' | 'A3' | 'A5' | 'Letter' | 'Legal' | 'Tabloid',
        landscape: options.landscape,
        printBackground: options.background,
        margin: {
          top: options.marginTop,
          right: options.marginRight,
          bottom: options.marginBottom,
          left: options.marginLeft
        },
        css: customCss
      };
      
      console.log(`Converting ${inputPath} to PDF...`);
      
      // Convert to PDF
      await markdownToPdf(markdown, pdfOptions);
      
      console.log(`PDF saved to: ${outputPath}`);
    } catch (error) {
      console.error('Error converting markdown to PDF:', error);
      process.exit(1);
    }
  });

program.parse();
