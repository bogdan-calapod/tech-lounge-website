/**
 * Tech Lounge
 *
 * Static website generation using Pug and Node-Sass
 */
let PROD = process.argv[2] == '--prod' ? true : false;

let Generator = require(__dirname + '/Generator');
let ncp = require('ncp');
let fb = require('fbgraph');

let accessToken = 'EAASpKySOahQBAGCr7t8QmVgxujdw97bVG6mzoX2IpUnTB1oLibChc1iMI1VnnaIYOuhES6RBWpuMZCwirOxevQNNZBswWc1EasIZCvm2A6ZApt9dz0yMi91hM62WudjLqZAQp7vQNAwv5ZBx901xP7Xpi1vqZAOi9DrnZC5TlFa9ZBwZDZD';
let pages = ['Innovation Labs', 'ccna.ro'];

fb.setAccessToken(accessToken);

// Get page listing
fb.get(
  '/me/accounts',
  (e, r) => {
    let p = toPromise(e, r);
    p.then(filterPages)
      .then(getEvents)
      .then(addEventURL)
      .then(buildWebsite)
  }
);

function toPromise(e, r) {return new Promise(resolve => {resolve(r)})}
function filterPages(x) {return x.data.filter(z => checkPageName(z.name))}
function getEvents(pages) {
  return Promise.all(
    pages.map(
      page => new Promise(resolve => {
        fb.get(
          '/' + page.id + '/events?fields=name,place,url,start_time,cover,owner&access_token=' + page.access_token,
          (e,r) => {resolve(r.data)}
        )})
    )
  )
}
function checkPageName(name) {return pages.filter(x => name.indexOf(x) > -1).length > 0}
function addEventURL(events) {
  return events.map(
    event => {event.url = 'https://www.facebook.com/events/' + event.id; return event;}
  )
}

function buildWebsite(events) {
  events = [].concat.apply(events[0], events[1]);
  // Order by date
  events = events.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

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
    '/build/index.html',
    {events: events.slice(0,3)}
  ).renderStyles().processAssets();
}