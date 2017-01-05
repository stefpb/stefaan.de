export default {
	output: {
		filename: 'scripts.js',
	},
	devtool: 'source-map',
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: [/node_modules/],
			},
		],
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
		alias: {
			jquery: "../../bower_components/jquery/src/jquery.js"
		}
	},
};
