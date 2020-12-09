var express = require( 'express' );
var tool = require( '../tool' );
var view = require( './view' );
var router = express.Router();


/* GET home page. */
router.get( '/', function ( req, res, next ) {
    if ( req.isAuthenticated() ) {
        res.redirect( '/user' );
    }
    else {
        res.set( {
            'X-Powered-By': 'KaraNoKara',
            // 'Access-Control-Allow-Origin': 'http://karanokara.com:3000',
        } );

        // render index.html using view obj
        res.render( 'index', view.loginView() );
    }

} );

module.exports = router;
