var express = require( 'express' );
var router = express.Router();

var view = {
  name: '',
  list: [

  ],
  settings: {

  },

};

/* GET users listing. */
router.get( '/', function ( req, res, next ) {

  // render user.html using view obj
  res.render( 'user', view );
} );

module.exports = router;
