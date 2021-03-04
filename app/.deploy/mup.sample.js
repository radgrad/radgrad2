module.exports = {
  servers: {
    one: {
      host: 'changeme.edu',
      username: 'root',
      password: 'changeme'
    }
  },
  hooks: {
    'pre.deploy': {
      localCommand: 'npm run update-build-version'
    }
  },
  app: {
    name: 'radgrad',
    path: '../',

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
      debug: true,
    },

    env: {
      ROOT_URL: 'https://changeme.edu',
      MONGO_URL: 'mongodb://mongodb/meteor',
      MONGO_OPLOG_URL: 'mongodb://mongodb/local',
    },

    docker: {
      image: 'abernix/meteord:node-12-base',
    },

    enableUploadProgressBar: true,
    deployCheckWaitTime: 900
  },

  mongo: {
    version: '3.4.1',
    servers: {
      one: {}
    }
  },

  proxy: {
    domains: 'changme.edu',
    ssl: {
      letsEncryptEmail: 'changeme@hawaii.edu',
      forceSSL: true
    }
  }
};
