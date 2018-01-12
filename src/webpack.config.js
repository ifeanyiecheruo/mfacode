const path = require("path");
const webpack = require('webpack');
const nodeExternals = require("webpack-node-externals");
const nameAllModulesPlugin = require("name-all-modules-plugin");
const PermissionsOutputPlugin = require('webpack-permissions-plugin');
const buildOutput = path.resolve(__dirname, "../bin");

module.exports = {
    entry: {
        "index": "./src/app/index.ts",
    },
    output: {
        filename: "[name].js",
        path: buildOutput,
        devtoolModuleFilenameTemplate: info => {
            // by default webpack emits source map urls with webpack://
            // which vs-code and chrome don't handle well
            // emit file:/// instead
            return "file:///"+encodeURI(info.absoluteResourcePath);
        }
    },
    resolve: {
        extensions: [ ".ts", ".tsx" ]
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                // typescript compile any .ts or .tsx files outside of node_modules
                use: "ts-loader",
                test: /\.tsx?$/,
                exclude: /node_modules/
            },
        ]
    },
    target: "node",
    externals: [
        nodeExternals() // exclude the contents of node_modules from bundling
    ],
    plugins: [
        new webpack.BannerPlugin({
            // prepend a shebang for the cli chunk so that just running "./mfacode" invokes node
            banner: "#!/usr/bin/env node",
            raw: true,
            entryOnly: true,
            include: [ /index\.js/ ]
        }),
        new PermissionsOutputPlugin({
            buildFolders: [ { 
                path: buildOutput,
                fileMode: "644",
                dirMode: "755"
            } ],
            buildFiles: [ {
                path: path.resolve(buildOutput, 'index.js'),
                fileMode: "755"
            } ]
        })
    ]
};
