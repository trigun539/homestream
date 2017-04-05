import { join }          from 'path';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import ExtractPlugin     from 'extract-text-webpack-plugin';

const HTMLConfig = new HTMLWebpackPlugin({
	template: join(__dirname, 'src/template.ejs'),
	title: 'HomeStream'
});

const ExtractConfig = new ExtractPlugin({ filename: 'styles.css', allChunks: true });

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
			},
			{
				test: /\.css$/,
				loader: ExtractPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader?modules&importLoaders=1&localIdentName=[name]__[local]__[hash:base64:5]!postcss-loader']
				})
			}
		]
	},
	plugins: [
		HTMLConfig,
		ExtractConfig
	]
};
