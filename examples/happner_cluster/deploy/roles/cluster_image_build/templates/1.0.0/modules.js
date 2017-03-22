module.exports = {
  modules: {
    'xxx': {
      instance: {
        start: function ($happn, callback) {
          this.interval = setInterval(function () {
            $happn.log.info('xxx');
          }, 1000);
        },
        stop: function ($happn, callback) {
          clearInterval(this.interval);
          callback();
        }
      }
    }
  },
  components: {
    'xxx': {
      startMethod: 'start',
      stopMethod: 'stop'
    }
  }
};
