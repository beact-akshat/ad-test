const log = (function (environment) {
    if (environment === 'development' || environment === 'local') {
        return (...args) => {
            console.log(...args)
        }
    }
})(process.env.NODE_ENV || 'local');


module.exports = {
    log
}