var express = require( 'express' );
var router = express.Router();

var view = {
  siteTitle: 'Nodebook - Login',
  signInTitle: 'A Simple Nodebook',

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
  // render index.html using view obj
  res.render( 'login', view );
} );

module.exports = router;
