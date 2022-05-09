const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = function override(config) {
    config.ignoreWarnings = [/Failed to parse source map/];

    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify"),
        "url": require.resolve("url"),
        "path": require.resolve("path-browserify"),
        "domain": require.resolve("domain-browser"),
        "console": require.resolve("console-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "constants": require.resolve("constants-browserify")
    })
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
            dotenv: new Dotenv({
                path: './.env'
            })
        })
    ])
    return config;
}