// 响应模板
class ModelBase {
    constructor(data, message, code) {
        if (typeof data === 'string') {
            this.data = null
            this.message = ''
            this.status = 0
        }

        if (data) {
            this.data = data
        }

        if (message) {
            this.message = message
        }

        if (code) {
            this.code = code
        }
    }
}

// 成功数据模型
class SucessMode extends ModelBase {
    constructor(data) {
        super(data, '请求成功', 200)
        // this.data = data
        // this.message = '请求成功'
        // this.code = 200
    }
}

// 失败数据模型
class FailureMode extends ModelBase {
    constructor(message) {
        super(null, message, 201)
    }
}

module.exports = {
    SucessMode,
    FailureMode
}