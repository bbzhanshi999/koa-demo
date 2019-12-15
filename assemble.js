const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const session = require('koa-session');
const redisStore = require("koa-redis");
const passport = require('./authPassport');
const json = require('koa-json');
const userRouter = require('./routers/userRouter')

const app = new Koa();
require('./mongoose-config')
app.keys = ['dsafjw4332'];

//配置session中cookie的名称和策略以及session的存储策略：redis
const CONFIG = {
    key: 'sessionid',
    maxAge: 86400000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
    store: redisStore({
        host: "127.0.0.1",
        port: 6379
    })
}
//注意中间件的加入顺序
app.use(session(CONFIG, app));
app.use(bodyparser());
app.use(json());
app.use(passport.initialize());
app.use(passport.session());

app.use(userRouter.routes()).use(userRouter.allowedMethods())


module.exports = app
