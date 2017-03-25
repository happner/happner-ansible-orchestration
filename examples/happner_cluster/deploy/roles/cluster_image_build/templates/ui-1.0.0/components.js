module.exports = {
  'happner-cluster-ui': {
    accessLevel: 'mesh',
    startMethod: 'start',
    stopMethod: 'stop',
    web: {
      routes: {
        'public': 'public'
      }
    }
  },
  'happner-cluster-info': {
    accessLevel: 'mesh',
    startMethod: 'start',
    stopMethod: 'stop'
  }
};
