const execSql = require('../db/mysql')

// 获取学生Id与错题记录
const getUserErrorQuestions = (req) => {
    let { uName, examId } = req.params;
    let sql = ''

    return new Promise((resolve, reject) => {
        sql = `SELECT id FROM students WHERE name = '${uName}'`
        return execSql(sql).then(data => {
            if (!data.length) {
                reject('该学生不存在');
                return
            }
            let { id } = data[0]
            sql = `SELECT q.*, er.created_at as error_time
                FROM
                    records er
                    CROSS JOIN JSON_TABLE(
                        er.wrong_list,
                        '$[*]' COLUMNS (question_id INT PATH '$')
                    ) AS jt
                    INNER JOIN ${examId} q ON q.id = jt.question_id
                WHERE
                    er.u_id = '${id}'`;
            return execSql(sql).then(data => {
                if (!data.length) reject(`学生${uName}未参加${examId}考试或考试满分`);
                resolve({
                    data,
                    id
                })
            })
        })
    })
}

// 插入或更新考试记录
const postUserErrorQuestions = (req) => {
    let { studentName, examId, wrongList } = req.body
    console.log(typeof wrongList, wrongList)
    let sql = ''
    // 根据 u_id & exam_id 查询考试记录，如果有，更新考试记录，无则新增
    // 多次写入记录，目的查看小朋友的错题，哪类题易错
    return execSql(`select id from students where name = '${studentName}'`).then(data => {
        const { id: uId } = data[0]
        // sql = `SELECT id FROM records WHERE u_id = ${uId} AND exam_id = '${examId}'`
        // return new Promise((resolve, reject) => {
        // return execSql(sql).then(data => {
        // if (!data.length) {
        sql = `INSERT INTO records(wrong_list, exam_id, u_id) VALUES ('${JSON.stringify(wrongList)}', '${examId}', ${uId})`
        return execSql(sql)
        // }
        // sql = `UPDATE records SET wrong_list = '${JSON.stringify(wrongList)}' WHERE u_id = '${uId}' and exam_id='${examId}'`
        // return execSql(sql).then(res => {
        //     resolve(res)
        // })
        // })
        // })
    })
}

// 保存考题
const postQuestions = (datas) => {
    let sql = `INSERT INTO Exam202409(id, question_text, question_images, options, examId, type, correct_answer, difficulty, explanation) VALUES`

    datas.map(item => {
        item.image = JSON.stringify(item.image)
        item.options = JSON.stringify(item.options)
        sql += `(${JSON.stringify(Object.values(item)).slice(1, -1)}), `
    })

    sql = sql.slice(0, -1)

    return execSql(sql)
}

// 获取考题
const getQuestions = (examId) => {
    let sql = `SELECT id,type,question_text,question_images,options,correct_answer,difficulty,explanation FROM ${examId} where id > 31`
    return execSql(sql)
}

module.exports = {
    getQuestions,
    postQuestions,
    getUserErrorQuestions,
    postUserErrorQuestions
}