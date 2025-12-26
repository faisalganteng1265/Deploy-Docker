const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
app.get('/', (req, res) => {
  res.send(`
    <h1>Server Uji Coba Aktif</h1>
    <p>Silakan pilih halaman yang ingin diakses:</p>
    <ul>
        <li><a href="/100kb">Liat File (100KB)</a></li>
        <li><a href="/1mb">Liat File (1MB)</a></li>
        <li><a href="/10mb">Liat File (10MB)</a></li>
    </ul>
  `);
});
app.get('/100kb', (req, res) => {
  res.sendFile(path.join(__dirname, '100kb.html'));
});
app.get('/1mb', (req, res) => {
  res.sendFile(path.join(__dirname, '1mb.html'));
});
app.get('/10mb', (req, res) => {
  res.sendFile(path.join(__dirname, '10mb.html'));
});
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

