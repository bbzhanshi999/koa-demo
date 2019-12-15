const Router = require('koa-router');
const userRouter = new Router();
const passport = require('../authPassport')
const User = require('../models/user.js')

userRouter.post('/sigin',async (ctx,next)=>{
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
            // Passport中间件带的ctx.login,触发user对象的序列化
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

/**
 * 注册用户
 */
userRouter.post("/signup",async (ctx,next)=>{
  let inputUser = ctx.request.body;
  let user = await User.find({username:inputUser.username})
  if(user.length){
    ctx.body = {
      code:-1,
      msg: '该用户已被注册'
    }
  }else{
    let newUser = await User.create(inputUser);
    if (newUser) {
      ctx.body = {
        status: 200,
        data: newUser,
        msg: '注册成功'
      }
    } else {
      ctx.body = {
        status: 0,
        msg: '注册失败'
      }
    }
  }
})

module.exports = userRouter