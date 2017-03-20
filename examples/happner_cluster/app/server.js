/**
 * Created by grant on 2016/12/16.
 */

var HappnerCluster = require('happner-cluster');
var config = require('./cluster_config');

//console.log('RESTART: ', Date.now());
//
//return setTimeout(function () {
//    process.exit(1);
//}, 200);

HappnerCluster.create(config)

    .catch(function (error) {
        console.error(error);
        process.exit(1);
    });
