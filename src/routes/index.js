

// const handleRoute = (req) => {
//     // 处理 get 请求
//     if (req.method === 'GET') {
//         if (req.url === '/') {
//             // return getExamData().then(res => {
//             //     return new SucessMode(res) // 返回模板数据
//             // })

//         }

//         console.log(req, 'url')
//         if (req.url === `/api/error-questions/${uId}/${examId}`) {
//             console.log(1)
//             return getUserErrorQuestions(1, 'CIE202406').then(res => {
//                 return new SucessMode(res)
//             })
//         }
//     }

//     // 处理 post 请求
//     if (req.method === 'POST') {
//         if (req.url === '/api/result/new') {
//             return postResult(req.body).then(res => {
//                 return new SucessMode(res)
//             })
//         }
//     }
// }

// module.exports = handleRoute

const express = require('express');
const router = express.Router();
const { postQuestions, getUserErrorQuestions, postUserErrorQuestions } = require('../controller/index');
const { SucessMode, FailureMode } = require('../model');

// 新增题目
router.post('/questions', (req, res) => {
    postQuestions(req).then(questions => {
        let { data } = new SucessMode(questions)
        res.json({
            ...data,
            ...req.params
        })
    })
})

router.get('/error-questions/:uName/:examId', (req, res) => {
    getUserErrorQuestions(req).then(questions => {
        let { data } = new SucessMode(questions)
        res.json({
            ...data,
            ...req.params
        })
    }).catch(err => {
        let errData = new FailureMode(err)
        res.json({
            ...errData
        })
    })
})

router.post('/error-questions', (req, res) => {
    postUserErrorQuestions(req).then(questions => {
        let { data } = new SucessMode(questions)
        res.json({
            ...data,
            ...req.params
        })
    })
})

module.exports = router;

