const mysql = require('mysql2/promise');

(async () => {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',       // 或使用 '127.0.0.1'
            user: 'root',             // 数据库用户名
            password: '1234',         // 数据库密码
            database: 'retail_system'// 数据库名
        });
        console.log('数据库连接成功');
        connection.end();
    } catch (error) {
        console.error('数据库连接失败', error.message);
    }
})();