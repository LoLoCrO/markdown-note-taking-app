import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import multer from 'multer';
import { marked } from 'marked';
import fs from 'fs';
import axios from 'axios';

dotenv.config();

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('json spaces', 2);

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    res.send('File uploaded');
});

app.get('/notes', (_req, res) => {
    fs.readdir('uploads/', (err, files) => {
        if (err) {
            return res.status(500).send('Error reading directory');
        }

        res.json(files);
    });
});

app.get('/notes/html/:filename', (req, res) => {
    const filename = req.params.filename;

    fs.readFile(`uploads/${filename}`, 'utf8', async (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }

        const html = marked.parse(data);

        res.json(html);
    });
}); 

app.get('/notes/tone/:filename', (req, res) => {
    const filename = req.params.filename;

    fs.readFile(`uploads/${filename}`, 'utf8', async (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }

        try {
            const response = await axios.post('https://api.sapling.ai/api/v1/tone', {
                key: process.env.SAPLING_API_KEY,
                text: data,
            });

            res.json(response.data);
        } catch (error) {
            if (!res.headersSent) {
                res.status(500).send('Error analyzing text');
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
