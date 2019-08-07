var express = require( 'express' );
var tool = require( '../tool' );
var database = require( '../database' );
var router = express.Router();

/**
 * if user is authenticated, 
 * they can do modifications below
 */
router.use( '/', tool.authenticateHere, function ( req, res, next ) {
    next();
} );

/**
 * handle adding note
 */
router.post( '/add', function ( req, res, next ) {

    var username = req.session.passport.user,
        title = req.body.title,
        content = req.body.content;

    if ( !title || !content )
        return res.status( 404 ).send( 'No data received.' );

    var info = database.addNote( username, title, content );

    // console.log( req.body );

    if ( info.status ) {
        res.send( JSON.stringify( info ) );
    }

    res.status( 401 ).send( info.msg );
} )
















module.exports = router;