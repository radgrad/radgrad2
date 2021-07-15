module.exports = {
  servers: { one: { host: 'CHANGEME.EDU', username: 'root', password: 'CHANGEME' }},
  hooks: {
    'pre.deploy': { localCommand: 'npm run update-build-version' },
    'post.deploy': { localCommand: 'mup logs' }
  },
  app: {
    name: 'radgrad',
    path: '../',
    servers: { one: {}},
    buildOptions: { serverOnly: true, debug: true }, // to avoid react production error, set debug: false
    env: {
      ROOT_URL: 'https://CHANGME.EDU',
      MONGO_URL: 'mongodb://mongodb/meteor',
      MONGO_OPLOG_URL: 'mongodb://mongodb/local',
    },
    docker: { image: 'zodern/meteor:latest' },
    enableUploadProgressBar: true,
    deployCheckWaitTime: 900
  },
  mongo: { version: '3.4.1', servers: { one: {} } },
  proxy: {
    domains: 'CHANGEME.EDU',
    ssl: { letsEncryptEmail: 'CHANGEME@HAWAII.EDU', forceSSL: true }
  }
};
