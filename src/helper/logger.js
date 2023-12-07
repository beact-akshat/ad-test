const log = (function (environment) {
      return (...args) => {
        console.log(...args)
    }
})(process.env.NODE_ENV || 'local');


module.exports = {
    log
}
