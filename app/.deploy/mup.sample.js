module.exports = {
  servers: {
    one: {
      host: 'radgrad2.ics.hawaii.edu',
      username: '',
      // pem: './path/to/pem'
      password: ''
      // or neither for authenticate from ssh-agent
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
      // abernix/meteord:node-12-base works with Meteor 1.9 - 1.10
      // If you are using a different version of Meteor,
      // refer to the docs for the correct image to use.
      image: 'abernix/meteord:node-12-base',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
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
