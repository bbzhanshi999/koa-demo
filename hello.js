const Koa = require('koa');
const app = new Koa();

app.use(ctx=>{
    ctx.body  = "<h1>Hello Koa!</h1>";

})

module.exports = app