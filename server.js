const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();

// Konfigurimi: Skedarët shkojnë në folderin 'uploads'
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use(express.json());

// Ngarkimi i skedarit
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ success: true });
});

// Marrja e listës
app.get('/api/files', (req, res) => {
    fs.readdir('./uploads', (err, files) => {
        if (err) return res.json([]);
        res.json(files);
    });
});

// Shkarkimi
app.get('/download/:name', (req, res) => {
    res.download('./uploads/' + req.params.name);
});

app.listen(3000, () => console.log('Arle IT Online!'));