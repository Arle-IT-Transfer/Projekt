const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const auth = require('basic-auth');
const app = express();

// Konfigurimi i ruajtjes së skedarëve
const upload = multer({ storage: multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => { cb(null, file.originalname); }
})});

// Funksioni i mbrojtjes me fjalëkalim
const checkAuth = (req, res, next) => {
    const credentials = auth(req);
    if (credentials && credentials.name === 'admin' && credentials.pass === 'Arle2026') {
        return next();
    }
    res.set('WWW-Authenticate', 'Basic realm="Arle IT Access"');
    res.status(401).send('Kërkohet fjalëkalim për të hyrë këtu.');
};

app.use(express.static('public'));

// 1. Ngarkimi
app.post('/upload', upload.array('file'), (req, res) => {
    res.send('<h1>Sukses!</h1><p>Skedarët u ngarkuan.</p><a href="/">Kthehu</a>');
});

// 2. Listimi (Me mbrojtje)
app.get('/files', checkAuth, (req, res) => {
    fs.readdir('./uploads', (err, files) => {
        if (err) return res.status(500).send("Gabim në leximin e folderit.");
        let list = files.map(f => `
            <li>
                <a href="/download/${f}">${f}</a> 
                <a href="/delete/${f}" style="color:red; margin-left:10px;">[Fshi]</a>
            </li>`).join('');
        res.send(`<h1>Skedarët e Arle IT:</h1><ul>${list}</ul><a href="/">Kthehu</a>`);
    });
});

// 3. Shkarkimi
app.get('/download/:filename', (req, res) => {
    res.download(path.join(__dirname, 'uploads', req.params.filename));
});

// 4. Fshirja (Me mbrojtje)
app.get('/delete/:filename', checkAuth, (req, res) => {
    fs.unlink(path.join(__dirname, 'uploads', req.params.filename), (err) => {
        if (err) return res.status(500).send("Gabim gjatë fshirjes.");
        res.send('Skedari u fshi! <br> <a href="/files">Kthehu te lista</a>');
    });
});

app.listen(3000, () => console.log('Serveri Arle IT aktiv ne porten 3000'));