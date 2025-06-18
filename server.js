const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const Database = require('better-sqlite3');

const app = express();
const db = new Database('shop.db');

app.use(cors());
app.use(express.json());

app.use('/css', express.static('css'));
app.use('/pages', express.static('pages'));
app.use('/scripts', express.static('scripts'));

// Главная страница админки
app.get('/', (_req, res) => {
    res.sendFile(process.cwd() + '/pages/admin.html');
});

// Создание таблиц
db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    image TEXT,
    category TEXT DEFAULT 'uncategorized',
    description TEXT DEFAULT ''
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS characteristics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
  )
`).run();

// Получение всех товаров с характеристиками
app.get('/products', (req, res) => {
    const search = req.query.search ? req.query.search.toLowerCase() : null;

    let products;
    if (search) {
        const stmt = db.prepare(`
            SELECT * FROM products
            WHERE LOWER(name) LIKE ?
               OR LOWER(description) LIKE ?
               OR LOWER(category) LIKE ?
        `);
        const keyword = `%${search}%`;
        products = stmt.all(keyword, keyword, keyword);
    } else {
        products = db.prepare('SELECT * FROM products').all();
    }

    const charStmt = db.prepare('SELECT name, value FROM characteristics WHERE product_id = ?');
    products = products.map(product => {
        const characteristics = charStmt.all(product.id);
        return {...product, characteristics };
    });

    res.json(products);
});

// Получение товара по ID с характеристиками
app.get('/products/:id', (req, res) => {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Товар не найден' });

    const characteristics = db.prepare('SELECT name, value FROM characteristics WHERE product_id = ?').all(product.id);
    res.json({...product, characteristics });
});

// Получение характеристик по ID товара
app.get('/products/:id/characteristics', (req, res) => {
    const characteristics = db.prepare('SELECT name, value FROM characteristics WHERE product_id = ?').all(req.params.id);
    if (!characteristics.length) {
        return res.status(404).json({ error: 'Характеристики не найдены' });
    }
    res.json(characteristics);
});

// Добавление товара
app.post('/products', (req, res) => {
    try {
        const { name, price, image, category, description } = req.body;
        if (!name || price == null) return res.status(400).json({ error: 'Требуются name и price' });

        const stmt = db.prepare('INSERT INTO products (name, price, image, category, description) VALUES (?, ?, ?, ?, ?)');
        const info = stmt.run(name, price, image || '', category || 'uncategorized', description || '');
        res.status(201).json({ id: info.lastInsertRowid, message: 'Товар добавлен' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Обновление товара
app.put('/products/:id', (req, res) => {
    const { name, price, image, category, description } = req.body;

    const stmt = db.prepare(`
        UPDATE products SET
        name = ?, price = ?, image = ?, category = ?, description = ?
        WHERE id = ?
    `);
    const result = stmt.run(name, price, image, category, description, req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ error: 'Товар не найден' });
    }

    // Удалим старые характеристики (если они потом добавляются отдельно)
    db.prepare('DELETE FROM characteristics WHERE product_id = ?').run(req.params.id);

    res.json({ message: 'Товар обновлён' });
});

// Добавление характеристик
app.post('/products/:id/characteristics', (req, res) => {
    const productId = req.params.id;
    const { characteristics } = req.body;
    if (!Array.isArray(characteristics)) return res.status(400).json({ error: 'Неверный формат характеристик' });

    const insert = db.prepare('INSERT INTO characteristics (product_id, name, value) VALUES (?, ?, ?)');
    const insertMany = db.transaction((chars) => {
        for (const c of chars) {
            insert.run(productId, c.name, c.value);
        }
    });

    try {
        insertMany(characteristics);
        res.json({ message: 'Характеристики добавлены' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка сервера при добавлении характеристик' });
    }
});

// Удаление всех характеристик по товару
app.delete('/products/:id/characteristics', (req, res) => {
    const productId = req.params.id;

    const stmt = db.prepare('DELETE FROM characteristics WHERE product_id = ?');
    const result = stmt.run(productId);

    if (result.changes > 0) {
        res.json({ message: 'Характеристики удалены' });
    } else {
        res.status(404).json({ error: 'Характеристики не найдены или уже удалены' });
    }
});

// Удаление товара по ID
app.delete('/products/:id', (req, res) => {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    const result = stmt.run(req.params.id);
    if (result.changes > 0) {
        db.prepare('DELETE FROM characteristics WHERE product_id = ?').run(req.params.id);
        res.json({ message: 'Удалено' });
    } else {
        res.status(404).json({ error: 'Не найдено' });
    }
});

// Удаление по имени
app.delete('/products/name/:name', (req, res) => {
    const product = db.prepare('SELECT id FROM products WHERE name = ?').get(req.params.name);
    if (!product) return res.status(404).json({ error: 'Не найдено' });

    db.prepare('DELETE FROM products WHERE id = ?').run(product.id);
    db.prepare('DELETE FROM characteristics WHERE product_id = ?').run(product.id);

    res.json({ message: 'Удалено' });
});




const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});