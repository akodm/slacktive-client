module.exports = {
  apps : [{
    name: 'Client',
    script: 'serve',
    instances: 1,
    env: {
      PM2_SERVE_PATH: './',
      PM2_SERVE_PORT: '3000',
      PM2_SERVE_SPA: 'true',
      PM2_SeRVE_HOMEPAGE: '/index.html'
    }
  }]
};