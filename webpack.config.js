const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const { walkDir, entryFrom } = require("./src/helpers/files");

const PAGE_DIR = path.join("src", "pages", path.sep);


// fallback/ example entry:

// const entry= {
//   'index': './src/index.js',
//   'products/product-1': './src/pages/products/product-1.js',
//   'contact' : './src/pages/contact.js'
// }
const entry = entryFrom(PAGE_DIR, walkDir(PAGE_DIR, [".js"]) );

const resolve= {
  alias:{
    src: path.resolve(__dirname, "src"),
    components: path.resolve(__dirname, "src", "components")
  }
}

const rulesModule= {
  rules: [{
     test: /\.js$/,
     exclude: /node_modules/,
     use: {
        loader: "babel-loader",
           options:{
              presets: [
                 "@babel/preset-env",
                 "@babel/preset-react"
              ]
           }
     }
  }]
}

const htmlPlugins = walkDir(PAGE_DIR, [".html"])
  .map(filePath => {
    const filename = filePath.replace(PAGE_DIR, "");
    return new HtmlWebPackPlugin({
      chunks: [ filename.replace(path.extname(filename), ""), "vendor" ],
      template: filePath,
      filename: filename
    })
});

// fallback/ example for specified files instead of walking directory
const plugins= [
  new HtmlWebPackPlugin({
    chunks:["contact", "vendor"],
    template: "src/pages/contact.html",
    filename: "contact.html"
})]

const optimization= {
  splitChunks: {
     cacheGroups: {
        vendor: {
           test: /node_modules/,
           chunks: "initial",
           name: "vendor",
           enforce: true
        }
     }
  }
}

module.exports = {
  entry,
  resolve,
  module : rulesModule,
  plugins : htmlPlugins ,
  optimization,
};
