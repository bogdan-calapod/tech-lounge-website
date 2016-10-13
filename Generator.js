/**
 * Tech Lounge
 *
 * Static website generator
 */ 

// Imports
let pug = require('pug');
let sass = require('node-sass');
let fs = require('fs-extra');
let ncp = require('ncp').ncp;
let zip = require('node-targz');
let readdir = require('recursive-readdir');
let postcss = require('postcss');
let autoprefixer = require('autoprefixer');

class Generator {
  constructor(config) {
    // TODO: Specify configuration options
    this.setConfig(config);
    
  }

  /// PUBLIC FUNCTIONS ///
  setConfig(config) {
    if(config)
      this.config = config;
  }

  renderPug(source, destination, locals) {
    console.log('[StatGen] Rendering Pug file:', this.config.rootPath + destination);

    // Ensure that the path exists
    try {
      fs.ensureFileSync(this.config.rootPath + destination);
    } catch (e) {
      console.log(e); process.exit();
    }

    let html = pug.renderFile(this.config.rootPath + source, locals);
    fs.writeFileSync(this.config.rootPath + destination, html);

    return this;
  }

  renderStyles() {
    console.log('[StatGen] Compiling SCSS files ');

    fs.ensureDirSync(this.config.rootPath + '/build/css');
    fs.ensureDirSync(this.config.rootPath + '/build/css/font');
    
    let options = this.config.sassOptions;
    options.file = this.config.rootPath + options.file;

    sass.render(
      this.config.sassOptions,
      (err, res) => {
        if(err)
          throw new Error(err);
        postcss([autoprefixer({cascade: false, browsers: '>1%'})]).process(res.css)
          .then(result => {
            fs.writeFileSync(
              this.config.rootPath + options.out,
              result
            )
          })
      }
    );

    // Move fonts
    ncp(
      this.config.rootPath + '/src/styles/font',
      this.config.rootPath + '/build/css/font'
    );

    return this;
  }

  processAssets() {
    console.log('[StatGen] Processing assets');
    
    fs.ensureDirSync(this.config.rootPath + '/build/js');

    this._copyStaticAssets()
        ._copyJavaScript();

    if(this.config.gzipAssets == true)
      this._gzipAssets();

    return this;
  }

  /// PRIVATE FUNCTIONS ///
  _copyStaticAssets() {
    console.log('[StatGen] Copying static assets');
    
    // Move static assets
    ncp(
      this.config.rootPath + '/src/img',
      this.config.rootPath + '/build/img'
    );

    // Clear teams folder
    fs.removeSync(this.config.rootPath + '/build/img/teams');
    
    // Move teams
    ncp(
      this.config.rootPath + '/' + this.config.teamsFolder,
      this.config.rootPath + '/build/img/teams'
    );

    return this;
  }

  _copyJavaScript() {
    // Get JS
    //TODO: Convert with Babel
    ncp(
      this.config.rootPath + '/src/js',
      this.config.rootPath + '/build/js'
    );

    return this;
  }

  _gzipAssets() {
    // TODO: Dynamically get file list from tree
    let fileList = [
      this.config.rootPath + '/build/index.html',
      this.config.rootPath + '/build/css/style.css',
      this.config.rootPath + '/build/js/community.js',
      this.config.rootPath + '/build/js/courses.js',
      this.config.rootPath + '/build/js/howtoapply.js',
    ];

    fileList.map(
      file => zip.compress({
        source: file,
        destination: file + '.gz'
      })
    );
  }
}

module.exports = Generator;