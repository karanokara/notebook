var express = require( 'express' );
var path = require( 'path' );
var mustache = require( 'mustache' );
var fs = require( 'fs' ); // this engine requires the fs module
var loginRouter = require( './routes/login' );
var usersRouter = require( './routes/users' );
var server = express();


// define the template engine
server.engine( 'html', function ( filePath, view, callback ) {
    fs.readFile( filePath, function ( err, data ) {
        if ( err )
            return callback( err );

        var renderedString = mustache.render( data.toString(), view );
        return callback( null, renderedString );
    } )
} );
server.set( 'views', './views' );
server.set( 'view engine', 'html' );


//var cookieParser = require('cookie-parser');
//var logger = require('morgan');

//server.use(logger('dev'));
server.use( express.json() );
server.use( express.urlencoded( { extended: false } ) );
//server.use(cookieParser());

/**
 * serving static files
 *                                  path to file
 * http://localhost:3000/files/  +  images/kitten.jpg
 */
server.use( '/files', express.static( path.join( __dirname, 'public' ) ) );

/**
 * Serving requests
 */
server.use( '/login', loginRouter );
server.use( '/user', usersRouter );
server.use( '/error', function ( req, res ) {
    res.send( '404 Not found!' );
} );

/**
 * Final route
 * A route match any path
 * will be used as the final choice
 * 
 */
server.use( function ( req, res ) {

    // If it is a new session
    // redirect to /login
    res.redirect( '/login' );


    // redirect to /users 
    //res.redirect( '/user' );


} );

module.exports = server;
