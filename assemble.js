const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const session = require('koa-session');
const redisStore = require("koa-redis");
const passport = require('koa-passport');
//const json = require('koa-json');
const LocalStrategy = require('passport-local');
const app = new Koa();

app.keys = ['dsafjw4332'];

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async function (username, password, done) {
    if (username !== "zhangsan" || password !== "1234") {
        return done(null,false,'密码错误')
    }
    return done(null, {username,password});
}))

// 序列化ctx.login()触发
passport.serializeUser(function (user, done) {
    // 用户登录成功之后，会把用户数据存到session当中
    done(null, user)
})

// 反序列化（请求时，session中存在"passport":{"user":"1"}触发）
passport.deserializeUser(function (user, done) {
    return done(null, user)
})

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
//app.use(json());
app.use(passport.initialize());
app.use(passport.session());

app.use(async (ctx, next) => {
    // if (ctx.path === "./favicon.ico") return;
    // let n = ctx.session.views || 0;
    // ctx.session.views = ++n;

    // ctx.body = n;
    //ctx.append("Content-Type","application/text");
    return passport.authenticate('local', function (err, user, info, status) {
        if (err) {
          ctx.body = {
            status: -1,
            msg: err
          }
        } else {
          if (user) {
            ctx.body = {
              status: 200,
              msg: '登录成功',
              user
            }
            // Passport中间件带的ctx.login
            return  ctx.login(user)
          } else {
            ctx.body = {
              status: 0,
              msg: info
            }
          }
        }
      })(ctx, next)
})

module.exports = app
