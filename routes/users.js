/**
 * 用户管理模块
 */
const router = require('koa-router')()
const User = require('../models/userSchema')
const Counter = require('../models/counterSchema')
const util = require('./../utils/util')
const config = require('../config')
const jwt = require('jsonwebtoken')
const md5 = require('md5')

router.prefix('/users')

// 用户登录
router.post('/login', async (ctx) => {
  try {
    const { userName, userPwd } = ctx.request.body
    /**
    * 返回数据库指定字段，有三种方式
    * 1. 'userId userName userEmail state role deptId roleList'
    * 2. {userId:1,_id:0}  1表示返回，0表示不返回
    * 3. select('userId')
    */
    const res = await User.findOne({
      userName,
      userPwd
    }, 'userId userName userEmail state role deptId roleList')  // 指定返回userId、userName......
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

// 用户列表
router.post('/list', async (ctx) => {
  const { userId, userName, state } = ctx.request.body
  const { page, skipIndex } = util.pager(ctx.request.body)
  let params = {}
  if (userId) params.userId = userId
  if (userName) params.userName = userName
  if (state && state !== 0) params.state = state
  try {
    //根据条件查询所有的用户，不返回_id和userPwd
    const query = User.find(params, { _id: 0, userPwd: 0 })
    const list = await query.skip(skipIndex).limit(page.pageSize)
    const total = await User.countDocuments(params)

    ctx.body = util.success({
      page: {
        ...page,
        total
      },
      list
    })
  } catch (error) {
    ctx.body = util.fail(`查询异常:${error.stack}`)
  }
})

// 用户删除/批量删除
router.post('/delete', async (ctx) => {
  const { userIds } = ctx.request.body
  // User.updateMany({ $or: [{ userId: '100001' }, { userId: '100002' }] }) 
  // 更新userId为'100001'或'100002'
  // User.updateMany({ userId: { $in: ['100001', '100002'] } })
  // 更新userId在['100001', '100002']里的
  const res = await User.updateMany({ userId: { $in: userIds } }, { state: 2 })
  if (res.modifiedCount) {
    ctx.body = util.success(res, `共删除${res.modifiedCount}条`)
    return
  }
  ctx.body = util.fail('删除失败')
})

// 用户新增/编辑
router.post('/operate', async (ctx) => {
  const { userId, userName, userEmail, job, mobile, state, roleList, deptId, action } = ctx.request.body
  if (action === 'add') {
    if (!userName || !userEmail || !deptId || !mobile) {
      ctx.body = util.fail('参数错误', util.CODE.PARAM_ERROR)
    }
    const res = await User.findOne({ $or: [{ userName }, { userEmail }, { mobile }] }, '_id userName userEmail mobile')
    if (res) {
      ctx.body = util.fail(`用户名+邮箱+手机号已存在相同用户`)
    } else {
      const doc = await Counter.findOneAndUpdate({ _id: 'userId' }, { $inc: { sequence_value: 1 } }, { new: true })
      try {
        const user = new User({
          userId: String(doc.sequence_value),
          userName,
          userPwd: md5('123456'),
          userEmail,
          mobile,
          role: 2,
          roleList,
          job,
          deptId,
          state
        })
        user.save()
        ctx.body = util.success({}, `用户创建成功`)
      } catch (error) {
        ctx.body = util.fail(`用户创建失败,${error.stack}`)
      }
    }

  } else {
    if (!deptId) {
      ctx.body = util.fail('部门不能为空', util.CODE.PARAM_ERROR)
      return;
    }
    if (!mobile) {
      ctx.body = util.fail('手机号不能为空', util.CODE.PARAM_ERROR)
      return;
    }
    try {
      const res = await User.findOneAndUpdate({ userId }, { mobile, job, state, roleList, deptId })
      ctx.body = util.success({}, `更新成功`)
    } catch (error) {
      ctx.body = util.fail(`更新失败,${error.stack}`)
    }
  }
})


module.exports = router
