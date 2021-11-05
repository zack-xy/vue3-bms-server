/**
 * 通用工具函数
 */
const log4j = require('log4js')
const CODE = {
  SUCCESS: 200,
  PARAM_ERROR: 101, // 参数错误
  USER_ACCOUNT_ERROR: 201, // 账号或密码错误
  USER_LOGIN_ERROR: 301, // 用户未登陆
  BUSINESS_ERROR: 401, //业务请求失败
  AUTH_ERROR: 501, //认证失败或者token过期
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
  
  fail (msg = '', code = CODE.BUSINESS_ERROR) {
    log4j.debug(msg)
    return {
      code, data, msg
    }
  }
}