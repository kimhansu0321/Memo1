const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./memo.db', (err) => {
    if (err) console.error(err.message);
    console.log('메모 데이터베이스(SQLite)에 연결되었습니다.');
});

db.run(`CREATE TABLE IF NOT EXISTS memos (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    content TEXT NOT NULL
)`);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/memo', (req, res) => {
    db.get('SELECT content FROM memos WHERE id = 1', [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ content: row ? row.content : '' });
    });
});

app.post('/api/memo', (req, res) => {
    const { content } = req.body;
    db.run(
        `INSERT OR REPLACE INTO memos (id, content) VALUES (1, ?)`,
        [content],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, message: '저장 완료' });
        }
    );
});

app.delete('/api/memo', (req, res) => {
    db.run('DELETE FROM memos WHERE id = 1', function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: '삭제 완료' });
    });
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
