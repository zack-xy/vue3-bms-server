/**
 * 审批模块
 */
const router = require('koa-router')()
const util = require('./../utils/util')
const config = require('../config')
const jwt = require('jsonwebtoken')

router.prefix('/approve')

// 测试token过期
router.post('/count', async (ctx) => {
  const token = ctx.request.headers.authorization
  try {
    jwt.verify(token, config.TOKEN_KEY)
    ctx.body = util.success({ data: 1 }, '成功')
  } catch (error) {
    ctx.body = util.fail('token过期')
  }
})


module.exports = router
