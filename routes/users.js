var express = require( 'express' );
var passport = require( 'passport' );
var tool = require( '../tool' );
var database = require( '../database' );
var view = require( './view' );
var router = express.Router();


router.use( '/', function ( req, res, next ) {
    console.log( 'In user.js: ---------------- session is: ' );
    console.log( req.session.passport );
    next();
} );



/* GET users listing. */
router.get( '/', tool.authenticateHere, function ( req, res, next ) {

    var userId = req.session.passport.user.userId;

    database.userLogin( userId, null, null, null, function ( result ) {
        if ( result.status ) {

            // console.log( view );

            // render index.html using view obj

            res.render( 'index', view.userView( result.data ) );
        }
        else
            res.send( result.msg );
    } );

} );

module.exports = router;
