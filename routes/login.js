var express = require( 'express' );
var tool = require( '../tool' );
var view = require( './view' );
var router = express.Router();

var loginView = {
  siteTitle: 'Notebook - Login',
  signInTitle: 'A Simple Notebook',
  bodyClasses: 'login',
  headScripts: [

  ],
  logoImage: '/files/images/note-no-shadow.svg',
  copyright: '2019, A little project'
};




/* GET home page. */
router.get( '/', function ( req, res, next ) {
  view.extend( loginView );

  view.body = tool.render( 'login', view );

  // render index.html using view obj
  res.render( 'index', view );

} );

module.exports = router;
