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

    console.log( req.body );

    if ( info.status ) {
        res.send( JSON.stringify( info ) );
    }
    else {
        res.status( 401 ).send( JSON.stringify( info ) );
    }
} );


router.post( '/edit', function ( req, res, next ) {

    var username = req.session.passport.user,
        id = req.body.id,
        title = req.body.title,
        content = req.body.content;

    if ( !title || !content || !id )
        return res.status( 404 ).send( 'No data received.' );

    var info = database.editNote( username, id, title, content );

    console.log( req.body );

    if ( info.status ) {
        res.send( JSON.stringify( info ) );
    }
    else {
        res.status( 401 ).send( JSON.stringify( info ) );
    }
} );

router.post( '/delete', function ( req, res, next ) {

    var username = req.session.passport.user,
        id = req.body.id;

    if ( !id )
        return res.status( 404 ).send( 'No data received.' );

    var info = database.deleteNote( username, id );

    console.log( req.body );

    if ( info.status ) {
        res.send( JSON.stringify( info ) );
    }
    else {
        res.status( 401 ).send( JSON.stringify( info ) );
    }
} );


router.post( '/displayName', function ( req, res, next ) {

    var username = req.session.passport.user,
        name = req.body.name;

    if ( !name )
        return res.status( 404 ).send( 'No data received.' );

    var info = database.changeDisplayName( username, name );

    console.log( req.body );

    if ( info.status ) {
        res.send( JSON.stringify( info ) );
    }
    else {
        res.status( 401 ).send( JSON.stringify( info ) );
    }
} );

router.post( '/password', function ( req, res, next ) {

    var username = req.session.passport.user,
        password = req.body.password;

    if ( !password )
        return res.status( 404 ).send( 'No data received.' );

    var info = database.changePassword( username, password );

    console.log( req.body );

    if ( info.status ) {
        res.send( JSON.stringify( info ) );
    }
    else {
        res.status( 401 ).send( JSON.stringify( info ) );
    }
} );









module.exports = router;