const mysql = require('mysql')
const dbConfig = require('./config')
require('dotenv').config({
    path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env'
});

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
