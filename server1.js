// express框架 快速构建web服务器
const express = require('express');
// 连接mysql
const mysql = require('mysql2');
// 允许前端跨域访问后端接口
const cors = require('cors');
// 用户处理图片上传
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 图片上传配置
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
        console.log('上传目录路径:', uploadDir);
        
        // 确保上传目录存在
        if (!fs.existsSync(uploadDir)) {
            console.log('创建上传目录');
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // 生成唯一文件名
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const filename = uniqueSuffix + ext;
        console.log('生成的文件名:', filename);
        cb(null, filename);
    }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
    console.log('文件类型:', file.mimetype);
    // 只接受图片文件
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('只允许上传图片文件！'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 限制5MB
    }
});

// express实例
const app = express();
app.use(cors());
// 让服务器支持解析JSON格式的请求
app.use(express.json());
// 提供静态文件访问
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 建立一个数据库连接池
const db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'retail_system'
});

// 测试数据库连接
db.getConnection((err, connection) => {
    if (err) {
        console.error('数据库连接错误:', err);
        return;
    }
    console.log('数据库连接成功');
    connection.release();
});

// 管理员登录
app.post('/admin/login',(req,res) => {
    const {username,password} = req.body;
    const query = 'select * from admins where username = ? and password = ?';
    db.query(query, [username,password],(err,results) =>{
        if(err) return res.status(500).json({success:false,message:'数据库错误'});
        if(results.length > 0){
            res.json({success:true,username});
        }else{
            res.json({success:false,message:'用户名或者密码错误'});
        }
    });
});

// 添加商品
app.post('/admin/products', upload.single('image'), (req,res) =>{
    console.log('收到添加商品请求');
    console.log('请求体:', req.body);
    console.log('文件信息:', req.file);

    try {
        const { name, price, stock } = req.body;
        // 修改图片路径，使用完整的URL
        const image = req.file ? `http://localhost:3002/uploads/${req.file.filename}` : null;
        
        if (!name || !price || !stock || !image) {
            console.log('缺少必填字段:', { name, price, stock, image });
            return res.status(400).json({
                success: false,
                message: '请填写所有必填字段并上传图片'
            });
        }

        const query = 'insert into products (name,image,price,stock,sales) values (?,?,?,?,0)';
        db.query(query, [name, image, price, stock], (err, result) => {
            if(err) {
                console.error('添加商品数据库错误:', err);
                return res.status(500).json({success:false, message:'添加商品失败'});
            }
            console.log('商品添加成功:', result);
            res.json({success:true, message:'商品添加成功', id: result.insertId});
        });
    } catch (error) {
        console.error('添加商品错误:', error);
        res.status(500).json({success:false, message:'服务器错误'});
    }
});

// 删除商品
app.delete('/admin/products/:id',(req,res) => {
    const{id} = req.params;
    const query = 'delete from products where id=?';

    db.query(query,[id],(err) => {
        if(err) return res.status(500).json({success:false,message:'删除商品失败'});
        res.json({success:true,message:'商品删除成功'});
    });
});

// 更新商品信息
app.put('/admin/products/:id', upload.single('image'), (req,res) => {
    try {
        const {id} = req.params;
        const { name, price, stock } = req.body;
        // 修改图片路径，使用完整的URL
        const image = req.file ? `http://localhost:3002/uploads/${req.file.filename}` : undefined;
        
        let query = 'update products set name = ?, price = ?, stock = ?';
        let params = [name, price, stock];
        
        if (image) {
            query += ', image = ?';
            params.push(image);
        }
        
        query += ' where id = ?';
        params.push(id);
        
        db.query(query, params, (err) => {
            if(err) {
                console.error('更新商品数据库错误:', err);
                return res.status(500).json({success: false, message:'更新商品失败'});
            }
            res.json({success: true, message:'更新商品成功'});
        });
    } catch (error) {
        console.error('更新商品错误:', error);
        res.status(500).json({success: false, message:'服务器错误'});
    }
});

// 获取所有商品
app.get('/admin/products', (req, res) => {
    console.log('收到获取商品列表请求');
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('获取商品列表错误:', err);
            res.status(500).json({ success: false, message: '获取商品列表失败' });
            return;
        }
        console.log('查询到的商品数据:', results);
        res.json({ success: true, products: results });
    });
});

// 获得具体单个商品详情
app.get('/admin/products/:id',(req,res) => {
    const {id} = req.params;
    const query = 'select * from products where id = ?';
    
    db.query(query, [id], (err, results) => {
        if(err) return res.status(500).json({success: false, message: '数据库错误'});
        
        if(results.length > 0) {
            res.json({success: true, product: results[0]});
        } else {
            res.json({success: false, message: '商品不存在'});
        }
    });
});

// 购买商品
app.post('/admin/products/:id/purchase', (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    
    // 开始事务
    db.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({ success: false, message: '数据库连接错误' });
        }
        
        connection.beginTransaction(err => {
            if (err) {
                connection.release();
                return res.status(500).json({ success: false, message: '事务开始失败' });
            }
            
            // 检查库存
            connection.query('SELECT stock FROM products WHERE id = ?', [id], (err, results) => {
                if (err) {
                    return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ success: false, message: '查询库存失败' });
                    });
                }
                
                if (results.length === 0) {
                    return connection.rollback(() => {
                        connection.release();
                        res.status(404).json({ success: false, message: '商品不存在' });
                    });
                }
                
                const currentStock = results[0].stock;
                
                if (currentStock < quantity) {
                    return connection.rollback(() => {
                        connection.release();
                        res.status(400).json({ success: false, message: '库存不足' });
                    });
                }
                
                // 更新库存和销量
                connection.query(
                    'UPDATE products SET stock = stock - ?, sales = sales + ? WHERE id = ?',
                    [quantity, quantity, id],
                    (err) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                res.status(500).json({ success: false, message: '更新库存失败' });
                            });
                        }
                        
                        // 提交事务
                        connection.commit(err => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ success: false, message: '提交事务失败' });
                                });
                            }
                            
                            connection.release();
                            res.json({ success: true, message: '购买成功' });
                        });
                    }
                );
            });
        });
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        message: err.message || '服务器错误'
    });
});

const PORT = process.env.PORT || 3002; // 修改默认端口为3002
app.listen(PORT, () => {
    console.log(`后台管理系统服务器运行在 http://localhost:${PORT}`);
});