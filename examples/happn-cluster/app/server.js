/**
 * Created by grant on 2016/12/16.
 */

var HappnCluster = require('happn-cluster');

// these environment variables are injected into each container by the Ansible/Docker build process
var mongoCollection = process.env['MONGO_COLLECTION'];
var mongoUrl = process.env['MONGO_URL'];
var port = process.env['PORT_MAPPING'].split(':')[0];

var hosts = [];

//var members = process.env['CLUSTER_MEMBERS'] != null ?
//    JSON.parse(process.env['CLUSTER_MEMBERS']) : null;

var members = process.env['CLUSTER_MEMBERS'];

for (var x = 0; x < members.length; x++) {
    var current = members[x];

    hosts.push(current.host + ':' + current.port);
}

var config = {
    name: 'happn-cluster-test',
    secure: true,
    services: {
        security: {
            config: {
                adminUser: {
                    username: '_ADMIN',
                    password: 'happn'
                }
            }
        },
        data: {
            path: 'happn-service-mongo-2',
            config: {
                collection: mongoCollection,
                url: mongoUrl
            }
        },
        orchestrator: {
            config: {
                // minimumPeers: 6,
                // replicate: ['/*'], //  ['/something/*', '/else'],
                // stableReportInterval: 2000,
                // stabiliseTimeout: 10 * 1000,
            }
        },
        membership: {
            config: {
                join: 'static',
                seed: 1,
                port: port,
                hosts: hosts
            }
        },
        proxy: {
            config: {
                port: 55000
            }
        }
    },
    port: port
};

// start the cluster
HappnCluster.create(config)
    .then(function (server) {

        console.log(server.services.orchestrator.peers);

        server.services.orchestrator.on('peer/add', function (member) {
            console.log('arriving peer\n', member);
        });

        server.services.orchestrator.on('peer/remove', function (member) {
            console.log('departing peer\n', member);
        });

        process.on('SIGINT', function () {
            server.stop(/*{kill: true, wait: 2000},*/ function () {
                // if (seq == 9) {
                //   console.log('kill', process.pid);
                //   return;
                // }
                process.exit(0);
            });
        })
    })
    .catch(function (error) {
        console.error('\n', error.stack ? error.stack : error);
        //process.exit(1);
    });
