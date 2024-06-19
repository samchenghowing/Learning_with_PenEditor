const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

let plugins = [];
function assetsPath(_path) {
	return path.posix.join("assets", _path);
}

if (process.env.NODE_ENV == "production") {
	plugins = [new BundleAnalyzerPlugin(), new CleanWebpackPlugin()];
	console.log("building in production mode")
	plugins = [new CleanWebpackPlugin()];
} else if (process.env.NODE_ENV == "development") {
	// const vendorManifest = require("./dist/json/vendor-manifest.json");
	// plugins = [new webpack.DllReferencePlugin({ manifest: vendorManifest })];
}

plugins = plugins.concat([
	new MiniCssExtractPlugin({
		filename: "styles/[name].[hash].css",
		chunkFilename: "styles/[id].[hash].css",
	}),
	new CopyWebpackPlugin({
		patterns: [
			{
				from: "./favicon.ico",
				to: "favicon.ico",
			},
			{
				from: "static",
				to: "static",
			},
		],
	}),
	new HtmlWebpackPlugin({
		chunks: ['app'],
		title: "PenEditor",
		favicon: path.resolve("favicon.ico"),
		template: "./src/template.html",
	}),
]);

module.exports = {
	entry: {
		app: "./src/index.js",
	},
	mode: process.env.NODE_ENV,
	output: {
		filename: "modules/[name].[hash].js",
		publicPath: "/",
		path: path.resolve(__dirname, "dist"),
	},
	devtool: process.env.NODE_ENV == "production" ? false : "source-map",
	devServer: {
		host: "0.0.0.0",
		port: 3000,
		historyApiFallback: true,
		allowedHosts: 'all',
		static: {
			directory: "./dist",
		},
		proxy: [
			{
				context: ['/api'],
				target: 'http://localhost:11434',
			}
		],
	},
	resolve: {
		extensions: [".js", ".json", ".jsx", ".less", ".css"],
	},
	module: {
		rules: [
			{
				test: /\.less$/,
				use: [
					{ loader: "style-loader" },
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: "../",
						},
					},
					{ loader: "css-loader" },
					{
						loader: "less-loader",
					},
				],
			},
			{
				test: /\.css$/,
				use: [
					{ loader: "style-loader" },
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: "../",
						},
					},
					{ loader: "css-loader" },
				],
			},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: "babel-loader?cacheDirectory=true",
					},
				],
			},
			{
				test: /\.mjs$/,
				include: /node_modules/,
				type: 'javascript/auto'
			},
			{
				test: /\.(webp|png|jpe?g|gif|svg|ttf|woff|eot)(\?.*)?$/,
				loader: "file-loader",
				options: {
					name: assetsPath("images/[name].[hash:7].[ext]"),
				},
			},
		],
	},
	plugins: plugins,
};
