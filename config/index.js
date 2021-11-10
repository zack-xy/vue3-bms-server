/**
 * 配置文件
 */
module.exports = {
  URL: 'mongodb://127.0.0.1:27017/vue3-bms',
  TOKEN_KEY: 'zackzheng-vue3BMS', // JWT秘钥
  TOKEN_TIME: 60 * 60 // 过期时间：1小时（3600秒）
}