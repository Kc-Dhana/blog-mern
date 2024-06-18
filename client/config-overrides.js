const webpack = require('webpack');
const StringReplacePlugin = require('string-replace-webpack-plugin');

module.exports = function override(config) {
    // Add fallbacks for Node.js core modules
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        zlib: require.resolve("browserify-zlib"),
        querystring: require.resolve("querystring-es3"),
        path: require.resolve("path-browserify"),
        crypto: require.resolve("crypto-browserify"),
        fs: false,
        stream: require.resolve("stream-browserify"),
        http: require.resolve("stream-http"),
        net: false,
        assert: require.resolve("assert/"),
        vm: require.resolve('vm-browserify'),
        async_hooks: false
    });
    config.resolve.fallback = fallback;

    // Provide process globally
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ]);

    // Add string replace loader for modifying require statements in express/lib/view.js
    config.module.rules.push({
        test: /express[\/\\]lib[\/\\]view\.js$/,
        use: [
            {
                loader: 'string-replace-loader',
                options: {
                    search: 'require\\(\'modPath\'\\)',
                    replace: 'require(modPath)',
                    flags: 'g'
                },
            },
        ],
    });

    return config;
};
