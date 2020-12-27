module.exports = {
  servers: {
    one: {
      host: 'radgrad2.ics.hawaii.edu',
      username: '',
      password: ''
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
    },

    env: {
      ROOT_URL: 'https://radgrad2.ics.hawaii.edu',
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
    domains: 'radgrad2.ics.hawaii.edu',
    ssl: {
      letsEncryptEmail: 'johnson@hawaii.edu'
    }
  }
};
