/**
 * Created by grant on 2016/12/16.
 */

var HappnCluster = require('happn-cluster');

//var config = JSON.parse(process.env['CLUSTER_CONFIG']);

var fs = require('fs');

fs.readFile('/cluster_config.json', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    var config = JSON.parse(data);

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
});

