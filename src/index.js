const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const setupSwagger = require('./swagger');

const app = express();
const port = 8080;

// middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

const dbPath = path.resolve(__dirname, 'db.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur lors de la connexion à SQLite:', err.message);
    } else {
        console.log('Connecté à la base de données SQLite.');
        db.run(`CREATE TABLE IF NOT EXISTS articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titre TEXT NOT NULL,
            contenu TEXT NOT NULL,
            auteur TEXT NOT NULL,
            date TEXT NOT NULL,
            categorie TEXT NOT NULL,
            tags TEXT
        )`);
    }
});

// documentation swagger
setupSwagger(app);

// ** endpoint html **
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ** endpoints API **

//Cree
app.post('/api/articles', (req, res) => {
    const { titre, contenu, auteur, date, categorie, tags } = req.body;

    if (!titre || !contenu || !auteur || !date || !categorie) {
        return res.status(400).json({ error: 'Tous les champs obligatoires doivent être fournis.' });
    }

    const sql = `INSERT INTO articles (titre, contenu, auteur, date, categorie, tags) VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [titre, contenu, auteur, date, categorie, tags];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            id: this.lastID,
            message: 'Article créé avec succès.'
        });
    });
});

//Lire tout
app.get('/api/articles', (req, res) => {
    const { category, author, date } = req.query;
    let sql = 'SELECT * FROM articles WHERE 1=1';
    let params = [];

    if (category) {
        sql += ' AND categorie = ?';
        params.push(category);
    }
    if (author) {
        sql += ' AND auteur = ?';
        params.push(author);
    }
    if (date) {
        sql += ' AND date = ?';
        params.push(date);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

//Recherche
app.get('/api/articles/search', (req, res) => {
    const { query } = req.query;
    if (!query) {
        return res.status(400).json({ error: 'Le paramètre de recherche "query" est requis.' });
    }

    const sql = `SELECT * FROM articles WHERE titre LIKE ? OR contenu LIKE ?`;
    const searchTerm = `%${query}%`;

    db.all(sql, [searchTerm, searchTerm], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

//Lire avec id
app.get('/api/articles/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM articles WHERE id = ?';

    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Article non trouvé.' });
        }
        res.json(row);
    });
});

//Modifier
app.put('/api/articles/:id', (req, res) => {
    const { id } = req.params;
    const { titre, contenu, categorie, tags } = req.body;

    let sql = 'UPDATE articles SET ';
    let params = [];
    let fields = [];

    if (titre) { fields.push('titre = ?'); params.push(titre); }
    if (contenu) { fields.push('contenu = ?'); params.push(contenu); }
    if (categorie) { fields.push('categorie = ?'); params.push(categorie); }
    if (tags) { fields.push('tags = ?'); params.push(tags); }

    if (fields.length === 0) {
        return res.status(400).json({ error: 'Aucun champ à modifier.' });
    }

    sql += fields.join(', ') + ' WHERE id = ?';
    params.push(id);

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Article non trouvé.' });
        }
        res.json({ message: 'Article mis à jour avec succès.' });
    });
});

// Supprimer
app.delete('/api/articles/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM articles WHERE id = ?';

    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Article non trouvé.' });
        }
        res.json({ message: 'Article supprimé avec succès.' });
    });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
