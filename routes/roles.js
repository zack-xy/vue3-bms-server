/**
 * 角色管理模块
 */
const router = require('koa-router')()
const Role = require('../models/roleSchema')
const util = require('./../utils/util')
const config = require('../config')
const jwt = require('jsonwebtoken')
const md5 = require('md5')
router.prefix('/roles')
// 查询所有的角色列表
router.post('/allList', async (ctx) => {
  try {
    const list = await Role.find({}, "_id roleName")
    ctx.body = util.success(list)
  } catch (error) {
    ctx.body = util.fail(`查询失败${error.stack}`)
  }
})
// 按页获取角色列表
router.post('/list', async (ctx) => {
  const { roleName } = ctx.request.body
  const { page, skipIndex } = util.pager(ctx.request.body)
  try {
    let params = {}
    if (roleName) params.roleName = roleName
    const query = Role.find(params)
    const list = await query.skip(skipIndex).limit(page.pageSize)
    const total = await Role.countDocuments(params)
    ctx.body = util.success({
      list,
      page: {
        ...page,
        total
      }
    })
  } catch (error) {
    ctx.body = util.fail(`查询失败:${error.stack}`)
  }
})
// 角色操作、创建、编辑和删除
router.post('/operate', async (ctx) => {
  const { roleName, remark, _id, action } = ctx.request.body
  let res, info
  try {
    if (action == 'add') {
      res = await Role.create({ roleName, remark })
      info = '创建成功'
    } else if (action == 'edit') {
      if (_id) {
        let params = { roleName, remark }
        params.updateTime = new Date()
        res = await Role.findByIdAndUpdate(_id, params)
        info = '编辑成功'
      } else {
        ctx.body = util.fail("缺少参数id")
        return
      }
    } else {
      if (_id) {
        res = await Role.findByIdAndRemove(_id)
        info = '删除成功'
      } else {
        ctx.body = util.fail("缺少参数id")
        return
      }
    }
    ctx.body = util.success(res, info)
  } catch (error) {
    ctx.body = util.fail(error.stack)
  }
})
// 权限设置
router.post('/update/permission', async (ctx) => {
  const { _id, permissionList } = ctx.request.body
  try {
    let params = { permissionList, updateTime: new Date() }
    let res = await Role.findByIdAndUpdate(_id, params)
    ctx.body = util.success(res, '权限设置成功')
  } catch (error) {
    ctx.body = util.fail(error.stack)
  }
})
module.exports = router