const fs = require('fs');
function generateHTML(targetSize, filename) {
  const header = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>File ${filename}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
        }
        .info {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .back-link {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background: #2196F3;
            color: white;
            text-decoration: none;
            border-radius: 4px;
        }
        .back-link:hover {
            background: #1976D2;
        }
        .content {
            margin-top: 20px;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>File Test ${filename}</h1>
        <div class="info">
            <strong>Ukuran Target:</strong> ${filename}<br>
            <strong>Waktu Generate:</strong> ${new Date().toLocaleString('id-ID')}
        </div>
        <div class="content">
            <p>Ini adalah file HTML yang di-generate untuk testing transfer data dengan ukuran ${filename}.</p>
            <p>File ini berisi konten dummy untuk mencapai ukuran yang diinginkan.</p>
`;

  const footer = `
        </div>
        <a href="/" class="back-link">← Kembali ke Halaman Utama</a>
    </div>
</body>
</html>`;
  const headerSize = Buffer.byteLength(header, 'utf8');
  const footerSize = Buffer.byteLength(footer, 'utf8');
  const remainingSize = targetSize - headerSize - footerSize;
  const dummyParagraph = '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>\n';
  
  const paragraphSize = Buffer.byteLength(dummyParagraph, 'utf8');
  const paragraphCount = Math.floor(remainingSize / paragraphSize);
  
  let content = header;
  for (let i = 0; i < paragraphCount; i++) {
    content += dummyParagraph;
  }
  const currentSize = Buffer.byteLength(content + footer, 'utf8');
  const stillNeeded = targetSize - currentSize;
  
  if (stillNeeded > 0) {
    content += '<!-- ' + 'X'.repeat(Math.max(0, stillNeeded - 7)) + ' -->';
  }
  
  content += footer;
  
  return content;
}

console.log('Generating 100kb.html...');
const content100kb = generateHTML(100 * 1024, '100KB');
fs.writeFileSync('100kb.html', content100kb);
console.log(`✓ 100kb.html created (${Buffer.byteLength(content100kb, 'utf8')} bytes)`);

console.log('Generating 1mb.html...');
const content1mb = generateHTML(1 * 1024 * 1024, '1MB');
fs.writeFileSync('1mb.html', content1mb);
console.log(`✓ 1mb.html created (${Buffer.byteLength(content1mb, 'utf8')} bytes)`);

console.log('Generating 10mb.html...');
const content10mb = generateHTML(10 * 1024 * 1024, '10MB');
fs.writeFileSync('10mb.html', content10mb);
console.log(`✓ 10mb.html created (${Buffer.byteLength(content10mb, 'utf8')} bytes)`);

console.log('\n✓ All files generated successfully!');