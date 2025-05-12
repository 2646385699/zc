const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 数据库连接配置
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // 更新后的用户名
    password: '1234', // 更新后的密码
    database: 'retail_system',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 模拟管理员账号密码（实际应用中应从数据库获取）
const adminUsername = 'admin';
const adminPassword = 'password';

// 登录接口
app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;
    if (username === adminUsername && password === adminPassword) {
        res.json({ success: true, message: '登录成功' });
    } else {
        res.json({ success: false, message: '用户名或密码错误' });
    }
});

// 获取商品信息接口
app.get('/admin/products/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [productId]);
        if (rows.length > 0) {
            res.json({ success: true, product: rows[0] });
        } else {
            res.json({ success: false, message: '商品不存在' });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: '获取商品信息失败' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});