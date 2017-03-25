// #version

var web = require('./web');
var modules = require('./modules');
var components = require('./components');

module.exports = {
  version: "#version",
  name: "#name",
  domain: 'DOMAIN_NAME',
  happn: {
    announceHost: "#announceHost",
    cluster: {
      requestTimeout: 10 * 1000,
      responseTimeout: 10 * 1000
    },
    secure: true,
    services: {
      security: {
        config: {
          adminUser: {
            username: "_ADMIN",
            password: "#adminPassword"
          }
        }
      },
      data: {
        config: {
          datastores: [
            {
              name: "mongo",
              provider: "happn-service-mongo-2",
              isDefault: true,
              settings: {
                database: "#mongoDb",
                collection: "#mongoCollection",
                url: "#mongoUrl"
              }
            }
          ]
        }
      },
      membership: {
        config: {
          seed: "#seed",
          seedWait: 1000,
          hosts: "#hosts"
        }
      }
    }
  },
  web: web,
  modules: modules,
  components: components
};
