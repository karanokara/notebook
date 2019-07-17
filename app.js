

var express = require( 'express' );
var path = require( 'path' );
var mustache = require( 'mustache' );
var fs = require( 'fs' ); // this engine requires the fs module
var indexRouter = require( './routes/index' );
var usersRouter = require( './routes/users' );
var app = express();


// define the template engine
app.engine( 'html', function ( filePath, view, callback ) {
    fs.readFile( filePath, function ( err, data ) {
        if ( err )
            return callback( err );

        var renderedString = mustache.render( data.toString(), view );
        return callback( null, renderedString );
    } )
} );
app.set( 'views', './views' );
app.set( 'view engine', 'html' );


//var cookieParser = require('cookie-parser');
//var logger = require('morgan');

//app.use(logger('dev'));
app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );
//app.use(cookieParser());
app.use( express.static( path.join( __dirname, 'public' ) ) );

app.use( '/', indexRouter );
app.use( '/users', usersRouter );

module.exports = app;
