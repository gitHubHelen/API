// 响应模板
class ModelBase {
    constructor(data, message, status) {
        if (typeof data === 'string') {
            this.data = null
            this.message = 'sucessed'
            this.status = '1'
        }

        if (data) {
            this.data = data
        }

        if (message) {
            this.message = message
        }

        if (status) {
            this.status = status
        }
    }
}

// 成功数据模型
class SucessMode extends ModelBase {
    constructor(data) {
        super(data, '', '')
        this.data = data
    }
}

// 失败数据模型
class FailureMode extends ModelBase {
    constructor(message) {
        super(null, message, '0')
    }
}

module.exports = {
    SucessMode,
    FailureMode
}