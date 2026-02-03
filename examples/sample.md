# サンプル文書

これはMarkdownからPDFへの変換をテストするためのサンプル文書です。

## 機能紹介

このツールセットには以下の機能が含まれています：

### 1. ライブラリ (Library)

Node.jsアプリケーションから直接使用できるプログラマティックAPI。

### 2. コマンドラインツール (CLI)

ターミナルから簡単にMarkdownファイルをPDFに変換できます。

### 3. HTTPサービス (Service)

RESTful APIを通じてMarkdownをPDFに変換するWebサービス。

## コード例

```javascript
const { markdownToPdf } = require('md-to-pdf');

async function convert() {
  const markdown = '# Hello World';
  const pdfBuffer = await markdownToPdf(markdown);
  console.log('PDF generated!');
}
```

## リスト

- 項目 1
- 項目 2
- 項目 3

### 番号付きリスト

1. 最初
2. 二番目
3. 三番目

## テーブル

| 機能 | 説明 |
|------|------|
| ライブラリ | プログラマティックAPI |
| CLI | コマンドラインツール |
| サービス | HTTPサーバー |

## 引用

> これは引用文です。
> 複数行にわたることができます。

## 強調

**太字のテキスト** と *斜体のテキスト* を使用できます。

## リンク

[GitHub](https://github.com) へのリンク。

---

以上です！
