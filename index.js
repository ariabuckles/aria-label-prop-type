if (process.env.NODE_ENV !== 'production') {
    module.exports = require('./aria-label-prop-type.dev.js');
} else {
    module.exports = require('./aria-label-prop-type.prod.js');
}
