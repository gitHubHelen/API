const fs = require('fs')
const path = require('path')
// function getContentData(filename, callback) {
//     // 拼接读取文件的路径 __dirname 当前文件的绝对路径
//     const fullfilename = path.resolve(__dirname, 'data', filename)
//     console.log(fullfilename)

//     fs.readFile(fullfilename, (err, data) => {
//         if (err) {
//             console.error(err)
//             return
//         }

//         callback(JSON.parse(data.toString()))
//     })
// }

// getContentData('a.json', (data) => {
//     console.log(data)
//     getContentData(data.next, (bdata) => {
//         console.log(bdata)
//         getContentData(bdata.next, (cdata) => {
//             console.log(cdata)
//         })
//     })
// })

// promise 处理异步回调
function getContentData(filename) {
    const promise = new Promise((resolve, reject) => {
        // 拼接读取文件的路径 __dirname 当前文件的绝对路径
        const fullfilename = path.resolve(__dirname, 'data', filename)

        fs.readFile(fullfilename, (err, data) => {
            if (err) {
                reject(err)
            }

            resolve(JSON.parse(data.toString()))
        })
    })

    return promise

}

getContentData('a.json').then(res => {
    console.log(res)
    return getContentData(res.next)
}).then(res => {
    console.log(res)
    return getContentData(res.next)
}).then(res => {
    console.log(res)
})