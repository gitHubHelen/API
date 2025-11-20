
// const http = require('http')
// require('dotenv').config()

// const handleServer = require('./src/handleServer')

// const port = process.env.SERVER_PORT || 3000;
// const host = process.env.HOST || '127.0.0.1'

// const server = http.createServer(handleServer)

// server.listen(port, () => {
//     console.log(`${host}:${port} is started`)
// })

// module.exports = server

const express = require('express');
const handleRoute = require('./src/routes/index')
const cors = require('cors');
require('dotenv').config();

// const { testConnection } = require('./config/database');
// const errorQuestionRoutes = require('./routes/errorQuestions');

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康检查路由
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: '服务运行正常',
        timestamp: new Date().toISOString()
    });
});

// API路由
app.use('/api', handleRoute);

// 404处理
app.use('', (req, res) => {
    res.status(404).json({
        success: false,
        message: '接口不存在'
    });
});

// 全局错误处理
app.use((err, req, res, next) => {
    console.error('全局错误:', err);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 启动服务器
async function startServer() {
    try {
        // 测试数据库连接
        // await testConnection();

        app.listen(PORT, () => {
            console.log(`🚀 服务器启动成功`);
            console.log(`📍 服务地址: http://localhost:${PORT}`);
            console.log(`📊 健康检查: http://localhost:${PORT}/health`);
            console.log(`🔍 错题API: http://localhost:${PORT}/api/error-questions`);
        });
    } catch (error) {
        console.error('❌ 服务器启动失败:', error);
        process.exit(1);
    }
}

startServer();

// module.exports = app;