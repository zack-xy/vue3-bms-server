/**
 * 用户管理模块
 */
const router = require('koa-router')()
const User = require('../models/userSchema')
const util = require('./../utils/util')
const config = require('../config')
const jwt = require('jsonwebtoken')

router.prefix('/users')

router.post('/login', async (ctx) => {
  try {
    const { userName, userPwd } = ctx.request.body
    const res = await User.findOne({
      userName,
      userPwd
    })
    if (res) {
      const data = res._doc
      const token = jwt.sign({
        data: data,
      }, config.TOKEN_KEY, {
        expiresIn: config.TOKEN_TIME
      })
      ctx.body = util.success({ ...data, token }, '登录成功')
    } else {
      ctx.body = util.fail('账号或密码不正确')
    }
  } catch (error) {
    ctx.body = util.fail(error.msg)
  }
})


module.exports = router
