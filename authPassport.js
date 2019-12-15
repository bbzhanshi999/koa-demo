const passport = require('koa-passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js')

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
}, async function (username, password, done) {
    let principal = await User.findOne({username,password});
    if (principal==null) {
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

module.exports = passport