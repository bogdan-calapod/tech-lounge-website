/**
 * Tech Lounge
 *
 * Static website generation using Pug and Node-Sass
 */
let PROD = process.argv[2] == '--prod' ? true : false;

let Generator = require(__dirname + '/Generator');
let ncp = require('ncp');

let config = {
  rootPath: __dirname,
  destination: './build',
  gzipAssets: PROD,
  sassOptions: {
    file: '/src/styles/index.scss',
    out: '/build/css/style.css',
    sourceMap: !PROD,
    outputStyle: PROD ? 'compressed' : 'nested'
  }
};

let g = new Generator(config);
g.renderPug(
  '/src/index.pug',
  '/build/index.html'
).renderStyles().processAssets();


