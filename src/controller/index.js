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
    let { uId, examId, wrongList } = req.body
    let sql = ''
    // 根据 u_id & exam_id 查询考试记录，如果有，更新考试记录，无则新增
    sql = `SELECT id FROM records WHERE u_id = ${uId} AND exam_id = '${examId}'`
    return new Promise((resolve, reject) => {
        return execSql(sql).then(data => {
            if (!data.length) {
                sql = `INSERT INTO records(wrong_list, exam_id, u_id) VALUES ('[1]', 'CIE202406',${uId})`
                return execSql(sql).then(res => {
                    resolve(res)
                })
            }
            sql = `UPDATE records SET wrong_list = '${JSON.stringify(wrongList)}' WHERE u_id = '${uId}'`
            return execSql(sql).then(res => {
                resolve(res)
            })
        })
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

module.exports = {
    postQuestions,
    getUserErrorQuestions,
    postUserErrorQuestions
}