const finalhandler = require('finalhandler');
const http         = require('http');
const Router       = require('router');
const bandcamp     = require('bandcamp-scraper');
const nthline      = require('nthline');
 
let router = Router(); 
let handler = Router({mergeParams: true});
let handler2 = Router({mergeParams: true});
let handler3 = Router({mergeParams: true});
let handler4 = Router({mergeParams: true});

router.get('/', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.end(JSON.stringify({"message": 'Hello'}));
});

router.use('/albuminfo/*', handler);
handler.get('/', function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  bandcamp.getAlbumInfo(req.params[0], function(error, albumInfo) {
    if (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({"error": error}));
    } else {
      res.statusCode = 200;
      res.end(JSON.stringify(albumInfo));
    }
  });
});

router.use('/albumsWithTag/:tag/:page', handler2);
handler2.get('/', function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  let params = {
    "page": parseInt(req.params.page), 
    "tag": req.params.tag}
  ; 
  bandcamp.getAlbumsWithTag(params, function(error, albumsWithTag) {
    if (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({"error": error}));
    } else {
      res.statusCode = 200;
      res.end(JSON.stringify(albumsWithTag));
    }
  });
});

router.use('/randomTag', handler3);
handler3.get('/', function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  let rand = getRandomInt(3575+1)     
  nthline(rand, 'bandcamp-tags.txt').then(line => 
    {
      res.end(JSON.stringify({"tag": line}));
    });
});

router.use('/randomTag/:count', handler4);
handler4.get('/', async function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  let tags = [];
  for (let i=0; i<parseInt(req.params.count); i++) {
    let rand = getRandomInt(3575+1)     
    tags.push(await nthline(rand, 'bandcamp-tags.txt'));
  }
  res.end(JSON.stringify({"tags": tags}));
});


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

let server = http.createServer(function(req, res) {
  router(req, res, finalhandler(req, res))
});
 
const port = process.env.PORT || 4000;
server.listen(port);
