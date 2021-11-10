const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const log4js = require('./utils/log4j')
const users = require('./routes/users')
const approve = require('./routes/approve')
const router = require('koa-router')()
const koajwt = require('koa-jwt')
const config = require('./config')
const util = require('./utils/util')

// error handler
onerror(app)

require('./config/db')

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))

app.use(json())

app.use(require('koa-static')(__dirname + '/public'))
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  log4js.info(`接口:${ctx.request.path}`);
  if (ctx.request.method.toLowerCase() === 'post') {
    log4js.info(`post参数: ${JSON.stringify(ctx.request.body)}`)
  } else if (ctx.request.method.toLowerCase() === 'get') {
    log4js.info(`get params: ${JSON.stringify(ctx.request.query)}`)
  }
  await next().catch(err => {
    if (err.status === 401) {
      ctx.status = 200
      ctx.body = util.fail('Token认证失败', util.CODE.AUTH_ERROR)
    } else {
      throw (err)
    }
  })
})

app.use(koajwt({ secret: config.TOKEN_KEY }).unless({
  path: [/^\/vue3Bms\/users\/login/]
}))


router.prefix('/vue3Bms')

router.use(users.routes(), users.allowedMethods())
router.use(approve.routes(), approve.allowedMethods())
app.use(router.routes(), router.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  log4js.error(`${err.stack}`)
});

module.exports = app