const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/agreement'),
  require('../routes/agreement-progress'),
  require('../routes/agreement-submit')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
