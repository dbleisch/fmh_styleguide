const webpack = require("webpack");

// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSASS = new ExtractTextPlugin('styles-[name].css');

// multiple entrypoints by
// https://medium.com/trabe/multiple-css-bundles-with-webpack-75f263095f09

module.exports = {
	// entry: './src/js/app.js',
	entry: {
		fmh: "./src/js/app.js",
		siwf:  "./src/js/siwf.js"
	 },
	output: {
		path: `${__dirname}/build/_src-r4/`,
		filename: 'app-[name].js',
		publicPath: '/_src-r4/',
	},
	resolve: {
		symlinks: false
	},
	plugins: [
		/*
		new UglifyJsPlugin({
			sourceMap: true
		}),
		*/
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			Popper: ['popper.js', 'default']
		}),
		extractSASS,
	],
	devtool: 'source-map',
	module: {
		rules: [{
			test: /\.scss$/,
			use: extractSASS.extract(
				[
					{
						loader: 'css-loader',
						options: {
							sourceMap: true
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true
						}
					},
				]
			)
		}, {
			test: /\.js$/,
			exclude: /node_modules/,
			use: 'babel-loader'
		}, {
			test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
			loader: 'file-loader?name=webfonts/[name].[ext]'
		}]
	}
}
