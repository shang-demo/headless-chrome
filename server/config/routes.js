
module.exports.routes = {

  // leancloud不使用云函数和Hook
  '/1.1/functions/_ops/metadatas': function leancloud(ctx) {
    ctx.status = 404;
  },

  // execCmd
  'get /api/:version(v\\d+)/cmd': 'ExecuteCmdController.help',
  'post /api/:version(v\\d+)/cmd': 'ExecuteCmdController.execCmd',
  '/api/:version(v\\d+)/cmd/token': 'ExecuteCmdController.generateToken',

  // webhook
  'get /api/v1/webhook/event': 'WebhookController.queryEvent',
  'get /api/v1/webhook': 'WebhookController.query',
  'get /api/v1/webhook/:id': 'WebhookController.get',
  'post /api/v1/webhook': 'WebhookController.create',
  'put /api/v1/webhook/:id': 'WebhookController.update',
  'delete /api/v1/webhook/:id': 'WebhookController.destroy',

  // index 页面
  '/*': async function viewHtml(ctx) {
    await ctx.render('index.html');
  }
};
