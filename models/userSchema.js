const mongoose = require('mongoose')
const useSchema = mongoose.Schema({
  "userId": Number, // 用户ID，自增长
  "userName": String, // 用户名称
  "userPwd": String, // 用户密码
  "userEmail": String, // 用户邮箱
  "mobile": String,
  "sex": Number, // 0:男 1:女
  "deptId": [], // 部门
  "job": String, // 岗位
  "state": {
    type: Number,
    default: 1
  }, // 1：在职 2：离职 3：试用期
  "role": {
    type: Number,
    default: 1
  }, // 用户角色： 0：系统管理员 1：普通用户
  "roleList": [],
  "createTime": {
    type: Date,
    default: Date.now()
  },
  "lastLoginTime": {
    type: Date,
    default: Date.now()
  },
  "remark": String // 额外字段
})

module.exports = mongoose.model('users', useSchema, "users")
// 最后一个users表示表名