/**
 * Created by grant on 2016/12/16.
 */

var HappnerCluster = require('happner-cluster');
var config = require('./cluster_config');

//process.exit(1);

HappnerCluster.create(config)

  .catch(function (error) {
    console.error(error);
    process.exit(1);
  });
