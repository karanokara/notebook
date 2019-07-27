

var express = require( 'express' );
var path = require( 'path' );
var mustache = require( 'mustache' );
var fs = require( 'fs' ); // this engine requires the fs module
var indexRouter = require( './routes/index' );
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


server.use( '/', indexRouter );
server.use( '/users', usersRouter );

module.exports = server;
