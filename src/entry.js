// Transpile all code following this line with babel and use 'env' (ES6) preset.
require('babel-register')({
    "presets": [
        ["env", {
            "targets": {
                "node": "current"
            }
        }]
    ],
    "plugins": ["transform-object-rest-spread"]})

// Import the rest of our application.
module.exports = require('./app')