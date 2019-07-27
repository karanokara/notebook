var express = require( 'express' );
var router = express.Router();

var indexView = {
  signInTitle: 'A Simple Nodebook',



  copyright: 'Huanhua Su little project'
};


/* GET home page. */
router.get( '/', function ( req, res, next ) {
  // render index.html using view obj
  res.render( 'index', indexView );
} );

module.exports = router;
