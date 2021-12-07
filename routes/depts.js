/**
 * 部门管理模块
 */
const router = require('koa-router')()
const Dept = require('../models/deptSchema')
const util = require('./../utils/util')
const config = require('../config')
const jwt = require('jsonwebtoken')
const md5 = require('md5')
router.prefix('/dept')

// 部门列表
router.post('/list', async (ctx) => {
  const { deptName } = ctx.request.body
  let params = {}
  if (deptName) params.deptName = deptName
  let rootList = await Dept.find(params)
  if (deptName) {
    ctx.body = util.success(rootList)
  } else {
    const treeList = getTreeDept(rootList, null, [])
    ctx.body = util.success(treeList)
  }
})

// 递归拼接树形列表
function getTreeDept (rootList, id, list) {
  for (let i = 0; i < rootList.length; i++) {
    let item = rootList[i];
    if (String(item.parentId.slice().pop()) === String(id)) {
      console.log('item=> ', item);
      list.push(item._doc)
    }
  }
  list.map(item => {
    item.children = []
    getTreeDept(rootList, item._id, item.children)
    if (item.children.length === 0) {
      delete item.children
    }
  })
  return list
}

// 部门创建/编辑/删除
router.post('/operate', async (ctx) => {
  const { _id, action, ...params } = ctx.request.body
  let res, info
  try {
    if (action == 'add') {
      res = await Dept.create(params)
      info = '创建成功'
    } else if (action == 'edit') {
      if (_id) {
        params.updateTime = new Date()
        res = await Dept.findByIdAndUpdate(_id, params)
        info = '编辑成功'
      } else {
        ctx.body = util.fail("缺少参数id")
        return
      }
    } else if (action == 'delete') {
      if (_id) {
        res = await Dept.findByIdAndRemove(_id)
        await Dept.deleteMany({ parentId: { $all: [_id] } })
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

module.exports = router