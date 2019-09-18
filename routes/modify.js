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

    var userId = req.session.passport.user.userId,
        title = req.body.title,
        content = req.body.content;

    if ( !title || !content )
        return res.status( 404 ).send( 'No data received.' );

    database.addNote( userId, title, content, function ( info ) {
        console.log( req.body );

        if ( info.status ) {
            res.send( JSON.stringify( info ) );
        }
        else {
            res.status( 401 ).send( JSON.stringify( info ) );
        }
    } );

} );


router.post( '/edit', function ( req, res, next ) {

    var userId = req.session.passport.user.userId,
        id = req.body.id,
        title = req.body.title,
        content = req.body.content;

    if ( !title || !content || !id )
        return res.status( 404 ).send( 'No data received.' );

    database.editNote( userId, id, title, content, function ( info ) {

        console.log( req.body );

        if ( info.status ) {
            res.send( JSON.stringify( info ) );
        }
        else {
            res.status( 401 ).send( JSON.stringify( info ) );
        }
    } );

} );

router.post( '/delete', function ( req, res, next ) {

    var userId = req.session.passport.user.userId,
        id = req.body.id;

    if ( !id )
        return res.status( 404 ).send( 'No data received.' );

    database.deleteNote( userId, id, function ( info ) {

        console.log( req.body );

        if ( info.status ) {
            res.send( JSON.stringify( info ) );
        }
        else {
            res.status( 401 ).send( JSON.stringify( info ) );
        }
    } );

} );


router.post( '/displayName', function ( req, res, next ) {

    var userId = req.session.passport.user.userId,
        name = req.body.name;

    if ( !name )
        return res.status( 404 ).send( 'No data received.' );

    database.changeDisplayName( userId, name, function ( info ) {
        console.log( req.body );

        if ( info.status ) {
            res.send( JSON.stringify( info ) );
        }
        else {
            res.status( 401 ).send( JSON.stringify( info ) );
        }
    } );

} );

router.post( '/password', function ( req, res, next ) {

    var userId = req.session.passport.user.userId,
        password = req.body.password;

    if ( !password )
        return res.status( 404 ).send( 'No data received.' );

    var info = database.changePassword( userId, password, function ( info ) {
        console.log( req.body );

        if ( info.status ) {
            res.send( JSON.stringify( info ) );
        }
        else {
            res.status( 401 ).send( JSON.stringify( info ) );
        }
    } );

} );

router.post( '/note-order', function ( req, res, next ) {

    var userId = req.session.passport.user.userId,
        noteOrderName = req.body.noteOrderName,
        noteOrderDirection = req.body.noteOrderDirection;

    if ( !noteOrderName || !noteOrderDirection )
        return res.status( 404 ).send( 'No data received.' );

    var info = database.changeNoteOrder( userId, noteOrderName, noteOrderDirection, function ( info ) {
        console.log( req.body );

        if ( info.status ) {
            res.send( JSON.stringify( info ) );
        }
        else {
            res.status( 401 ).send( JSON.stringify( info ) );
        }
    } );

} );









module.exports = router;