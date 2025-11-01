const express = require('express');
const app = express();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwtDecode = require('jwt-decode');
const multer = require('multer');
const { Pool } = require('pg');
const port = 3001;
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const nodemailer = require('nodemailer');


const JWT_SECRET = process.env.JWT_SECRET || '8580a4d1366ee61a885b97ccdd2089d7a354df9477cebbf7973a73b92ca74bdd6cb8087bffd4886913c7b7c669d33c31c6e4392fe31048019c4bc15b1500fa1347e205e3b6243e05f66e3f73af49da2a189d50f4c03487c7a273ed533af79dabe40a2d1045beafe3f3a636023f0fb1e091c7d6392cfca78317be438443487da2ccef3192f457c6bc634efd1782600097dfd00928682d6822541dc1d2b67a6b84e96715d7c5c6db8c3e6f855a1168dcb5085e4761408a279239ae120f053f90885c5fb594c0644896cbfcb73ecfe3c731d605fbde3be734f7ede17ccffc2e6ad3dd5cdc8a0c07a3f10fcb0c57c64bbf686d7d93d8c6b71ee885fcad1702855bf5';
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10);
const UPLOAD_DIR = process.env.UPLOAD_DIR || '/stars';
const PUBLIC_STARS = path.join(__dirname, '..', 'public', 'stars'); // если server.js в backend/

fs.mkdirSync(UPLOAD_DIR, { recursive: true });


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'StarsSite',
  password: '12345678',
  port: 5432,
});

app.use(helmet());
app.use(express.json());
app.use(cors({
  origin: '*', // заменить на домен
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use((err, req, res, next) => {
  console.error(err);
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Server error' });
  } else {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});

app.use('/stars', express.static(PUBLIC_STARS, {
  index: false,
  extensions: ['png','jpg','jpeg','webp']
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/auth', authLimiter);


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${randomUUID()}${ext}`);
  }
});

function fileFilter (req, file, cb) {
  const allowed = ['image/png','image/jpeg','image/webp'];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error('Invalid file type'), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const PORT = 3001;
const server = http.createServer(app);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server, verifyClient: (info, done) => done(true) });
const CACHE_FILE = path.join(__dirname, 'cache.json');

// Функция для чтения кэша
function readCache() {
  try {
    const data = fs.readFileSync(CACHE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return { posts: [], lastUpdate: null };
  }
}

// При запуске сервера создаем кэш, если его нет
if (!fs.existsSync(CACHE_FILE)) {
  writeCache({ posts: [], lastUpdate: null });
}

// Запись в кэш
function writeCache(data) {
  const cacheData = {
    posts: data.posts,
    lastUpdate: new Date().toISOString()
  };
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
}

wss.on('connection', (ws) => {
  console.log('Клиент подключен');
  // Отправляем текущие посты при подключении
  const cache = readCache();
  ws.send(JSON.stringify(cache.posts)); 
  ws.on('close', () => {
    console.log('Клиент отключен');
  });
});

app.post('/api/order', (req, res) => {
  const { productId } = req.body;
  console.log(`Заказ оформлен на товар ID: ${productId}`);
  res.json({ success: true });
});

pool.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к PostgreSQL:', err.stack);
  } else {
    console.log('Подключено к PostgreSQL');
  }
});

pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(e => console.error('Ошибка создания таблицы users', e));

pool.query(`
  CREATE TABLE IF NOT EXISTS stars (
    id VARCHAR(20) PRIMARY KEY,
    color_hex VARCHAR(7) NOT NULL,
    size VARCHAR(10) NOT NULL,
    texture_id VARCHAR(20) NOT NULL,
    accessory_id VARCHAR(20) NOT NULL,
    price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(e => console.error('Ошибка создания таблицы stars', e));

// app.use(express.json());

// В файле с базой данных добавьте:
pool.query(`
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    color VARCHAR(50),
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`).catch(e => console.error('Ошибка создания таблицы products', e));


app.get('/api/test-db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    res.json({ status: 'OK', time: result.rows[0].now });
  } catch (err) {
    console.error('Ошибка подключения к БД:', err);
    res.status(500).json({ status: 'DB ERROR', error: err.message });
  }
});

// GET все отзывы
app.get('/api/reviews', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM reviews_table
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Ошибка при получении отзывов:', err); // Логирование
    res.status(500).json({ error: err.message });
  }
});

// POST новый отзыв
app.post('/api/reviews', async (req, res) => {
  console.log('[DEBUG] Получен запрос:', req.body); 
  
  try {
    const { author, text, rating } = req.body;
    
    // Проверка типа данных
    if (typeof rating !== 'number') {
      throw new Error('Rating must be a number');
    }
    
    const { rows } = await pool.query(
      `INSERT INTO reviews_table (author, text, rating) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [author, text, rating]
    );
    
    console.log('[DEBUG] Успешное сохранение:', rows[0]); 
    res.status(201).json(rows[0]);
    
  } catch (err) {
    console.error('[ERROR] Ошибка сервера:', err); 
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  console.log('Получен заголовок Authorization:', authHeader);

  if (!authHeader) return res.status(401).json({ error: 'Токен отсутствует' });

  const parts = authHeader.split(' ');
  const token = parts.length === 2 ? parts[1] : null;

  if (!token || token === 'undefined') return res.status(401).json({ error: 'Токен отсутствует' });

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      console.log('JWT verify error:', err);
      return res.status(403).json({ error: 'Недействительный токен' });
    }
    req.user = payload; // payload содержит { id, email }
    next();
  });
}

app.post('/api/orders', authenticateToken, async (req, res) => {
  const { starId, quantity, totalPrice } = req.body;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      'INSERT INTO orders (user_id, star_id, quantity, total_price) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, starId, quantity, totalPrice]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка создания заказа:', err);
    res.status(500).json({ error: 'Не удалось создать заказ' });
  }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Ошибка подключения к PostgreSQL:', err);
  } else {
    console.log('Успешное подключение к PostgreSQL:', res.rows[0].now);
  }
});

app.get('/api/products', async (req, res) => {
  try {
    console.log('[DEBUG] Запрос на получение товаров'); 
    const { rows } = await pool.query(`
      SELECT * FROM products
      ORDER BY created_at DESC
    `);

    const productsWithDetails = rows.map(product => {
      const sizeMapping = {
        'small': 'Маленький (15-10см)',
        'medium': 'Средний (27х21см)', 
        'large': 'Большой (40х49см)'
      };
      
      const display_size = sizeMapping[product.size] || product.size;
      
      const full_description = `${product.name} - ${display_size}`;
      
      return {
        ...product,
        display_size: display_size,
        full_description: full_description
      };
    });

    console.log('[DEBUG] Получено товаров:', productsWithDetails.length); 
    res.json(productsWithDetails);
  } catch (err) {
    console.error('[ERROR] Ошибка при получении товаров:', err.message); 
    console.error('[ERROR DETAILS]:', err); 
    res.status(500).json({ error: 'Database error' });
  }
});

// Обновленный POST /api/products
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, color } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Изображение обязательно' });
    }

    const imagePath = '/stars/' + req.file.filename;
    
    const { rows } = await pool.query(
      `INSERT INTO products (name, description, price, color, image) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [name, description, price, color, imagePath]
    );
    
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Ошибка при добавлении товара:', err);
    res.status(500).json({ 
      error: 'Ошибка сервера',
      details: err.message 
    });
  }
});

app.put('/api/products/:id', upload.single('image'), async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, price, color } = req.body;
    
    const productResult = await pool.query(`
      SELECT * FROM products WHERE id = $1`,
      [id]
    );
    
    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const imagePath = req.file 
      ? '/stars/' + req.file.filename 
      : productResult.rows[0].image;

    const { rows } = await pool.query(`
      UPDATE products 
      SET name = $1, description = $2, price = $3, color = $4, image = $5 
      WHERE id = $6
      RETURNING *`,
      [name, description, price, color, imagePath, id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error('Ошибка при обновлении товара:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const { rowCount } = await pool.query(`
      DELETE FROM products WHERE id = $1`,
      [id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Ошибка при удалении товара:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/stars', async (req, res) => {
  try {
    const { id, color_hex, size, texture_id, accessory_id, price } = req.body;

    // Вставляем данные
    const result = await pool.query(
      `INSERT INTO stars (id, color_hex, size, texture_id, accessory_id, price)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         color_hex = EXCLUDED.color_hex,
         size = EXCLUDED.size,
         texture_id = EXCLUDED.texture_id,
         accessory_id = EXCLUDED.accessory_id,
         price = EXCLUDED.price
       RETURNING *`,
      [id, color_hex, size, texture_id, accessory_id, price]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка сохранения звезды:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/stars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM stars WHERE id = $1', 
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Звезда не найдена' });
    }

    const starData = result.rows[0];
    
    // Добавляем человеко-читаемый размер к ответу
    const responseData = {
      ...starData,
      display_size: starData.size
    };
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка получения звезды:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/register',
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Пароль минимум 8 символов'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array().map(e => ({ msg: e.msg, param: e.param })) });
    }

    const { email, password } = req.body;

    try {
      // дополнительно: приведение к lower-case, чтобы избежать дублирования
      const normalizedEmail = email.toLowerCase();

      // проверка есть ли уже пользователь
      const exist = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
      if (exist.rows.length) {
        return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
      }

      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      const result = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
        [normalizedEmail, passwordHash]
      );

      const user = result.rows[0];

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

      // возвращаем только необходимые поля
      res.status(201).json({ token, user: { id: user.id, email: user.email } });
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Email уже занят' });
      }
      res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Неверные учетные данные' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
      token, 
      user: result.rows[0] 
    });
    
  } catch (err) {
    console.error('Ошибка входа:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    console.log('Получен токен:', req.user); // ← должен содержать id и email
    const result = await pool.query(
      'SELECT id, email, created_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка получения данных пользователя:', err);
    res.status(500).json({ error: 'Не удалось получить данные' });
  }
});

app.get('/api/orders/user/:userId', authenticateToken, async (req, res) => {
  try {
    const userIdFromToken = req.user.id;
    const userIdFromParams = parseInt(req.params.userId);

    if (userIdFromToken !== userIdFromParams) {
      return res.status(403).json({ error: 'Нет доступа' });
    }

    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY order_date DESC',
      [userIdFromToken]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка загрузки заказов:', err);
    res.status(500).json({ error: 'Не удалось загрузить заказы' });
  }
});


app.use('/models', express.static(path.join(__dirname, 'models')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Настройка транспорта для отправки email
const transporter = nodemailer.createTransport({
  host: 'smtp.yandex.ru', // или ваш SMTP-сервер
  port: 587,
  secure: false,
  auth: {
    user: 'odkeynotgay@yandex.ru',
    pass: 'zawspdtlwyloxsdi'
  },
  // connectionTimeout: 10000,
  // greetingTimeout: 10000,
  // socketTimeout: 10000,
  // dnsTimeout: 10000
});

transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Ошибка подключения к SMTP:', error);
  } else {
    console.log('✅ SMTP сервер готов к отправке писем');
  }
});


app.post('/api/send-order-email', async (req, res) => {
  try {
    console.log('📧 Получен запрос на отправку email:', req.body);
    
    const { to, subject, order } = req.body;

    // Валидация входных данных
    if (!to || !subject || !order) {
      return res.status(400).json({ error: 'Отсутствуют обязательные поля' });
    }

    const formatTime = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const formattedTimestamp = formatTime(new Date());

    const emailText = `
      Новый заказ!

      Клиент: ${order.customer.name}
      Телефон: ${order.customer.phone}
      Комментарий: ${order.customer.comment || "Не указан"}

      Товары:
      ${order.items.map(item => {
        let itemText = `- ${item.name}`;
        
        if (item.is_custom) {
          itemText += ` (КАСТОМ)`;
          itemText += ` | Цвет: ${item.configuration?.color_name || item.configuration?.color}`;
          itemText += ` | Размер: ${item.configuration?.size_label || item.configuration?.size}`;
          itemText += ` | Текстура: ${item.configuration?.texture_name || item.configuration?.texture}`;
          if (item.configuration?.accessory) {
            itemText += ` | Аксессуар: ${item.configuration?.accessory_name || item.configuration?.accessory}`;
          }
        } else {
          if (item.full_description) {
            itemText += ` | ${item.full_description}`;
          } else if (item.size) {
            itemText += ` | Размер: ${item.size}`;
          }
        }
        
        itemText += ` | ${item.quantity} шт. × ${item.price} руб. = ${item.price * item.quantity} руб.`;
        
        return itemText;
      }).join('\n')}

      Итого: ${order.total} руб.
      Общее количество: ${order.quantity}

      Время заказа: ${formattedTimestamp}
      `;

    const mailOptions = {
      from: '"НОВЫЙ ЗАКАЗ ЗВЕЗДЫ" <odkeynotgay@yandex.ru>',
      to: to,
      subject: subject,
      text: emailText,
      html: `
        <!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Новый заказ</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #2F553D; color: white; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
                .section { background: #f9f9f9; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #2F553D; }
                .total { background: #2F553D; color: white; padding: 20px; text-align: center; border-radius: 8px; font-weight: bold; }
                .item { border-bottom: 1px solid #ddd; padding: 15px 0; }
                .item:last-child { border-bottom: none; }
                .item-image { max-width: 80px; max-height: 80px; margin-right: 15px; border-radius: 8px; }
                .item-details { display: flex; align-items: flex-start; }
                .item-info { flex: 1; }
                .item-name { font-weight: bold; margin-bottom: 5px; font-size: 1.1em; }
                .item-config { background: #e8f5e8; padding: 8px 12px; border-radius: 6px; margin: 5px 0; font-size: 0.9em; }
                .custom-badge { background: #ff6b6b; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.8em; margin-left: 8px; }
                .footer { text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 0.9em; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎉 НОВЫЙ ЗАКАЗ</h1>
                <p>№${Date.now().toString().slice(-6)}</p>
            </div>
            
            <div class="section">
                <h3>👤 ИНФОРМАЦИЯ О КЛИЕНТЕ</h3>
                <p><strong>Имя:</strong> ${order.customer.name}</p>
                <p><strong>Телефон:</strong> ${order.customer.phone}</p>
                <p><strong>Комментарий к доставке:</strong> ${order.customer.comment || 'Не указан'}</p>
                <p><strong>Дата заказа:</strong> ${formattedTimestamp}</p>
            </div>

            <div class="section">
                <h3>🛍️ СОСТАВ ЗАКАЗА</h3>
                ${order.items.map(item => `
                    <div class="item">
                        <div class="item-details">
                            ${item.image ? `<img src="http://localhost:3001${item.image}" alt="${item.name}" class="item-image" />` : ''}
                            <div class="item-info">
                                <div class="item-name">
                                    ${item.name}
                                    ${item.is_custom ? `<span class="custom-badge">КАСТОМ</span>` : ''}
                                </div>
                                
                                ${item.is_custom ? `
                                    <div class="item-config">
                                        <strong>Конфигурация:</strong><br>
                                        • Цвет: ${item.configuration?.color_name || item.configuration?.color}<br>
                                        • Размер: ${item.configuration?.size_label || item.configuration?.size}<br>
                                        • Текстура: ${item.configuration?.texture_name || item.configuration?.texture}<br>
                                        ${item.configuration?.accessory ? `• Аксессуар: ${item.configuration?.accessory_name || item.configuration?.accessory}<br>` : ''}
                                    </div>
                                ` : `
                                    ${item.full_description ? `<div class="item-config"><strong>Описание:</strong> ${item.full_description}</div>` : ''}
                                    ${item.size && !item.full_description ? `<div class="item-config"><strong>Размер:</strong> ${item.size}</div>` : ''}
                                `}
                                
                                <p style="margin: 10px 0 0; font-weight: bold;">
                                    Цена: ${item.price} руб. × ${item.quantity} шт. = ${item.price * item.quantity} руб.
                                </p>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div class="total">
                <h2>💰 ОБЩАЯ СУММА: ${order.total} РУБ.</h2>
                <p>Количество товаров: ${order.quantity} шт.</p>
            </div>

            <div class="footer">
                <p>Это автоматическое уведомление о новом заказе на сайте.</p>
                <p>Для связи с клиентом используйте указанный телефон.</p>
                <p>© ${new Date().getFullYear()} Магазин Звезд</p>
            </div>
        </body>
        </html>
        `
    };

    console.log('📤 Отправка письма с настройками:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Письмо отправлено успешно:', {
      messageId: info.messageId,
      response: info.response
    });

    res.json({ 
      success: true, 
      message: 'Email отправлен успешно',
      messageId: info.messageId 
    });
    
  } catch (error) {
    console.error('❌ Ошибка отправки email:', {
      error: error.message,
      code: error.code,
      command: error.command
    });
    
    res.status(500).json({ 
      error: 'Не удалось отправить email',
      details: error.message 
    });
  }
});

app.post('/api/test-email', async (req, res) => {
  try {
    const testMailOptions = {
      from: '"Тест" <odkeynotgay@yandex.ru>',
      // to: 'ivan.balyvredin@gmail.com',
      to: 'nadyaonline@gmail.com',
      subject: 'Тестовое письмо от сервера',
      text: 'Это тестовое письмо. Если вы его получили, значит SMTP работает корректно.',
      html: '<h2>Тестовое письмо</h2><p>Если вы его получили, значит SMTP работает корректно.</p>'
    };

    const info = await transporter.sendMail(testMailOptions);
    
    res.json({ 
      success: true, 
      message: 'Тестовое письмо отправлено',
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Ошибка тестовой отправки:', error);
    res.status(500).json({ 
      error: 'Ошибка тестовой отправки',
      details: error.message 
    });
  }
});