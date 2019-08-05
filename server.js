var express = require( 'express' );
var session = require( 'express-session' );
var path = require( 'path' );
var mustache = require( 'mustache' );
var fs = require( 'fs' ); // this engine requires the fs module
var loginRouter = require( './routes/login' );
var usersRouter = require( './routes/users' );
var server = express();
var passport = require( 'passport' );
var strategyLocal = require( 'passport-local' ).Strategy;
//var strategyGoogle = require( 'p' );


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
 * using passport session
 */
server.use( session( {
    secret: 'DEADBEEF0FEEBDAED1DEADBEEF',
    resave: false,
    saveUninitialized: true,
} ) );
server.use( passport.initialize() );
server.use( passport.session() );


passport.serializeUser( function ( user, done ) {
    console.log( '-----------' );
    console.log( user );

    done( null, user );
} );

passport.deserializeUser( function ( id, done ) {
    // User.findById( id, function ( err, user ) {
    //     done( err, user );
    // } );
} );


/**
 * Configure strategy to be used for passport
 */
passport.use( new strategyLocal(
    {
        // name attribute of <input> in the login form
        usernameField: 'username',
        passwordField: 'password',
    },
    // A verify callback fnc for passport.authenticate() 
    // after parsing the credentials
    function ( username, password, done ) {
        console.log( username );
        console.log( password );

        if ( username == 'test' && password == 'logmein' )
            return done( null, true, { message: 'succeed' } );
        else
            // 1st parameter is err in callback below
            return done( null, false, { message: 'failed' } );
    }
) );

/**
 * validate user login info
 */
// server.post( '/validate',
//     passport.authenticate( 'local', {
//         session: true,
//         successRedirect: '/login',
//         failWithError: true,    // enable fnc below to be called
//     } ),
//     // for success callback
//     function ( req, res, next ) {

//         //console.log( req );
//         console.log( res );
//         console.log( res.req.session );

//         res.send( '{ "msg": "success!"}' );
//     },
//     // for failed callback
//     function ( err, req, res, next ) {
//         // this fnc call the verify callback above
//         //console.log( req );
//         console.log( res );
//         console.log( err );

//         res.send( '{ "msg": "fail!"}' );
//     }
// );

server.post( '/validate', function ( req, res, next ) {
    passport.authenticate( 'local', function ( err, user, info ) {
        // done( err, user, infor );    from above
        console.log( res );
        console.log( info );
        console.log( user );
        console.log( err );

        if ( err ) {
            return next( err );
        }
        if ( !user ) {
            res.status( 401 ).send( '{ "msg": "fail!"}' );
            return;
        }

        req.logIn( 'mememe', function ( err ) {
            if ( err ) { return next( err ); }

            res.send( '{ "msg": "success!"}' );

        } );

    } )( req, res, next );
} );


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
