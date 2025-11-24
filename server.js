// 加载环境变量
require('dotenv').config({ path: '.env' });

console.log('=== 环境变量状态 ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SERVER_PORT:', process.env.SERVER_PORT);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

const cors = require('cors');
const express = require('express');
const mysql = require('mysql2');
const app = express();
const handleRoute = require('./src/routes/index')

// 中间件配置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS 配置选项
const corsOptions = {
//    origin: [
  //      'http://localhost:3000',  // Live Server 默认端口
    //    'http://127.0.0.1:3000',  // Live Server 默认端口
      //  'http://localhost:8090',  // 其他可能的本地服务器
        //'http://127.0.0.1:8090',  // 其他可能的本地服务器
        //'http://babiescoding.xyz'  // 生产环境域名
    //],
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
};

// 应用 CORS 中间件
app.use(cors(corsOptions));

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 创建数据库连接
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
    timezone: '+08:00'
};

console.log('数据库配置:', {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    database: dbConfig.database
});

const pool = mysql.createPool(dbConfig);

// 测试数据库连接
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ 数据库连接失败:', err.message);
        console.error('错误详情:', {
            code: err.code,
            errno: err.errno,
            sqlState: err.sqlState
        });
    } else {
        console.log('✅ 数据库连接成功');
        connection.release();
    }
});

// 手动设置 CORS 头（替代 cors 中间件）
app.use((req, res, next) => {
    // 设置允许的源
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');

    // 设置允许的 HTTP 方法
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    // 设置允许的请求头
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // 允许携带凭证（如 cookies）
    res.header('Access-Control-Allow-Credentials', 'true');

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    next();
});


// 健康检查端点
app.get('/health', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({
                status: 'unhealthy',
                database: 'disconnected',
                error: err.message,
                timestamp: new Date().toISOString()
            });
        }

        connection.query('SELECT 1 as test', (queryErr, results) => {
            connection.release();

            if (queryErr) {
                return res.status(500).json({
                    status: 'unhealthy',
                    database: 'error',
                    error: queryErr.message,
                    timestamp: new Date().toISOString()
                });
            }

            res.json({
                status: 'healthy',
                database: 'connected',
                timestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV
            });
        });
    });
});

// 调试端点 - 显示所有环境变量（不显示密码）
app.get('/debug/env', (req, res) => {
    const envVars = {
        NODE_ENV: process.env.NODE_ENV,
        SERVER_PORT: process.env.SERVER_PORT,
        DB_HOST: process.env.DB_HOST,
        DB_USER: process.env.DB_USER,
        DB_NAME: process.env.DB_NAME,
        DB_PORT: process.env.DB_PORT,
        LOG_LEVEL: process.env.LOG_LEVEL,
        CORS_ORIGIN: process.env.CORS_ORIGIN,
        PORT: process.env.PORT,
        HOST: process.env.HOST
    };

    res.json(envVars);
});

// 测试数据库端点
app.get('/debug/db-test', (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message,
                code: err.code
            });
        }

        connection.query('SELECT * FROM test_table LIMIT 5', (queryErr, results) => {
            connection.release();

            if (queryErr) {
                return res.status(500).json({
                    success: false,
                    error: queryErr.message,
                    code: queryErr.code
                });
            }

            res.json({
                success: true,
                data: results[0],
                timestamp: new Date().toISOString()
            });
        });
    });
});

const PORT = process.env.SERVER_PORT || process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// API路由
app.use('/api', handleRoute);

app.listen(PORT, HOST, () => {
    console.log(`🚀 服务器启动成功`);
    console.log(`📍 地址: http://${HOST}:${PORT}`);
    console.log(`🌍 环境: ${process.env.NODE_ENV}`);
    console.log(`🗄️  数据库: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('正在关闭服务器...');
    pool.end();
    process.exit(0);
});
