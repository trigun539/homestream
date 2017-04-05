import { join } from 'path';
import HTMLWebpackPlugin from 'html-webpack-plugin';

const HTMLConfig = new HTMLWebpackPlugin({
	template: join(__dirname, 'src/template.ejs'),
	title: 'HomeStream',
});

export default {
	context: join(__dirname, 'src'),
	entry: './main.js',
	output: {
		path: join(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	resolve: {
		modules: [
			'node_modules',
			'./src'
		]
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: join(__dirname, 'node_modules')
			}
		]
	},
	plugins: [
		HTMLConfig
	]
};
