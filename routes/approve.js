/**
 * 审批模块
 */
const router = require('koa-router')()
const util = require('./../utils/util')
const config = require('../config')
const jwt = require('jsonwebtoken')

router.prefix('/approve')

// 测试
router.post('/count', async (ctx) => {
  ctx.body = util.success({ data: 1 }, '成功')
})


module.exports = router
