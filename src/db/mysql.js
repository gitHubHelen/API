const mysql = require('mysql')
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

console.log(dbConfig)

// 创建数据库连接对象
const mysqlConnection = mysql.createConnection(dbConfig)

// 连接数据库
mysqlConnection.connect()
// 执行 sql 语句
function execSql(sql) {
    return new Promise((resolve, reject) => {
        mysqlConnection.query(sql, (err, res) => {
            if (err) {
                reject(err)
            }
            if (res && res.affectedRows > 0) resolve('更新数据成功')
            resolve(res)
        })
    })

}

// // 关闭连接
// mysqlConnection.end()

module.exports = execSql
