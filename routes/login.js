var express = require( 'express' );
var tool = require( '../tool' );
var router = express.Router();

var view = {
  siteTitle: 'Notebook - Login',
  signInTitle: 'A Simple Notebook',
  bodyClasses: 'login',
  stylesheets: [
    'files/stylesheets/bootstrap.min.css',
    'files/stylesheets/style.css',
    'files/stylesheets/sign-in.css',
  ],
  headScripts: [

  ],
  logoImage: '/files/images/note-no-shadow.svg',
  copyright: '2019, A little project'
};


/* GET home page. */
router.get( '/', function ( req, res, next ) {

  view.body = tool.render( 'login', view );
  // render index.html using view obj

  res.render( 'index', view );

} );

module.exports = router;
