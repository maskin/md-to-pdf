# md-to-pdf

MarkDown文書をPDFに変換するサービス・ライブラリ・コマンドなツール群

A comprehensive toolset for converting Markdown documents to PDF, including a library, CLI tool, and HTTP service.

## 特徴 (Features)

- 📚 **ライブラリ (Library)**: Node.jsアプリケーションから直接使用できるプログラマティックAPI
- ⌨️ **コマンドラインツール (CLI)**: ターミナルから簡単にMarkdownファイルをPDFに変換
- 🌐 **HTTPサービス (Service)**: RESTful APIを通じてMarkdownをPDFに変換するWebサービス
- 🎨 カスタムCSSによるスタイリング対応
- 📄 複数の用紙サイズとフォーマット対応
- 🔧 柔軟な設定オプション

## インストール (Installation)

```bash
npm install md-to-pdf
```

## 使用方法 (Usage)

### 1. ライブラリとして使用 (As a Library)

```javascript
const { markdownToPdf } = require('md-to-pdf');

async function convertMarkdown() {
  const markdown = `
# Hello World

This is a **markdown** document.
  `;
  
  // Convert to PDF buffer
  const pdfBuffer = await markdownToPdf(markdown);
  
  // Or save directly to file
  await markdownToPdf(markdown, {
    output: './output.pdf',
    format: 'A4',
    margin: {
      top: '20mm',
      bottom: '20mm',
      left: '20mm',
      right: '20mm'
    }
  });
}
```

#### オプション (Options)

```typescript
interface PdfOptions {
  output?: string;           // Output file path
  format?: 'A4' | 'A3' | 'A5' | 'Letter' | 'Legal' | 'Tabloid';
  margin?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  printBackground?: boolean; // Print background graphics
  landscape?: boolean;       // Landscape orientation
  css?: string;             // Custom CSS
}
```

### 2. コマンドラインツールとして使用 (As a CLI Tool)

```bash
# Basic usage
md-to-pdf input.md

# Specify output file
md-to-pdf input.md -o output.pdf

# Use different paper format
md-to-pdf input.md -f Letter

# Landscape mode
md-to-pdf input.md --landscape

# Custom margins
md-to-pdf input.md --margin-top 30mm --margin-bottom 30mm

# Apply custom CSS
md-to-pdf input.md --css custom-styles.css
```

#### CLIオプション (CLI Options)

```
Options:
  -o, --output <file>         Output PDF file path
  -f, --format <format>       Paper format (A4, A3, A5, Letter, Legal, Tabloid) (default: "A4")
  --landscape                 Use landscape orientation
  --no-background             Do not print background graphics
  --margin-top <size>         Top margin (e.g., 20mm) (default: "20mm")
  --margin-right <size>       Right margin (e.g., 20mm) (default: "20mm")
  --margin-bottom <size>      Bottom margin (e.g., 20mm) (default: "20mm")
  --margin-left <size>        Left margin (e.g., 20mm) (default: "20mm")
  --css <file>                Custom CSS file to apply
  -h, --help                  Display help
```

### 3. HTTPサービスとして使用 (As an HTTP Service)

#### サーバーの起動 (Starting the Server)

```bash
# Build first
npm run build

# Start server
npm run start:server

# Or specify custom port
PORT=8080 npm run start:server
```

#### APIエンドポイント (API Endpoints)

**1. Convert with options**

```bash
curl -X POST http://localhost:3000/convert \
  -H "Content-Type: application/json" \
  -d '{
    "markdown": "# Hello World\n\nThis is a test.",
    "options": {
      "format": "A4",
      "landscape": false
    }
  }' \
  --output document.pdf
```

**2. Simple conversion**

```bash
curl -X POST http://localhost:3000/convert/simple \
  -H "Content-Type: text/markdown" \
  --data-raw "# Simple Document" \
  --output simple.pdf
```

**3. Health check**

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "ok",
  "service": "md-to-pdf"
}
```

## 開発 (Development)

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode for tests
npm run test:watch
```

## テスト (Testing)

このプロジェクトにはJestを使用した包括的なテストスイートが含まれています：

```bash
npm test
```

## 例 (Examples)

`examples/` ディレクトリにサンプルファイルがあります：

```bash
# Build first
npm run build

# Convert the sample
node dist/cli/index.js examples/sample.md -o sample.pdf
```

## 技術スタック (Tech Stack)

- **TypeScript**: Type-safe development
- **Puppeteer**: PDF generation engine
- **markdown-it**: Markdown parser
- **Express**: HTTP server framework
- **Commander**: CLI framework
- **Jest**: Testing framework

## ライセンス (License)

MIT

## 貢献 (Contributing)

Contributions are welcome! Please feel free to submit a Pull Request.

## サポート (Support)

If you encounter any issues, please open an issue on GitHub.
