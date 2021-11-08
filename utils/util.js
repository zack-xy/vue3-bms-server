/**
 * 通用工具函数
 */
const log4j = require('./log4j')
const CODE = {
  SUCCESS: 200,
  PARAM_ERROR: 1001, // 参数错误
  USER_ACCOUNT_ERROR: 2001, // 账号或密码错误
  USER_LOGIN_ERROR: 3001, // 用户未登陆
  BUSINESS_ERROR: 4001, //业务请求失败
  AUTH_ERROR: 5001, //认证失败或者token过期
}
module.exports = {
  /**
   * 分页结构封装
   * @param {number} pageNum 
   * @param {number} pageSize 
   */
  pager ({ pageNum = 1, pageSize = 10 }) {
    pageNum = pageNum * 1
    pageSize = pageSize * 1
    const skipIndex = (pageNum - 1) * pageSize
    return {
      page: {
        pageNum,
        pageSize
      },
      skipIndex
    }
  },

  success (data = '', msg = '', code = CODE.SUCCESS) {
    log4j.debug(data)
    return {
      code, data, msg
    }
  },

  fail (msg = '', code = CODE.BUSINESS_ERROR, data = '') {
    log4j.debug(msg)
    return {
      code, data, msg
    }
  }
}