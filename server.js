var express = require( 'express' );
var session = require( 'express-session' );
var path = require( 'path' );
var mustache = require( 'mustache' );
var fs = require( 'fs' ); // this engine requires the fs module
var loginRouter = require( './routes/login' );
var usersRouter = require( './routes/users' );
var server = express();
var database = require( './database' );
var tool = require( './tool' );
var view = require( './routes/view' );
var passport = require( 'passport' );
var strategyLocal = require( 'passport-local' ).Strategy;
//var strategyGoogle = require( 'p' );


// define the template engine
server.engine( 'html', function ( filePath, view, callback ) {
    fs.readFile( filePath, function ( err, data ) {
        if ( err )
            return callback( err, '@error' );

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

/**
 * call once after a user is authenticated
 * user is put into the req.session.passport
 */
passport.serializeUser( function ( user, done ) {
    console.log( '> Storing User  - - - - - - - - ' );
    console.log( user );

    // user is put into the req.session.passport
    done( null, user );
} );

/**
 * this fnc will be called every time once 
 * a user has a session
 * "user" is a specific user 
 * can load different data according to which user
 * having this session
 */
passport.deserializeUser( function ( user, done ) {
    console.log( '> Loading user data - - - - - - -- - ' );

    // User.findById( id, function ( err, user ) {
    console.log( user );

    // put data into req.user
    done( null, user );

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

        var info = database.userLogin( username, password );

        if ( info.status ) {
            info.data = view.userView( info.data ).body;

            // user is just username
            // so session is storing username
            return done( null, username, info );
        }
        else {
            return done( null, false, info );
        }
    }
) );

/**
 * validate user login info
 * this fnc can receive fail message from above,
 * user fnc below instead
 */
// server.post( '/validate',
//     passport.authenticate( 'local', {
//         session: true,
//         // successRedirect: '/login',
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

        if ( err ) {
            return next( err );
        }
        else if ( !user ) {
            res.status( 401 ).send( JSON.stringify( info ) );
            return;
        }
        else {
            req.logIn( user, function ( err ) {
                if ( err ) {
                    return next( err );
                }

                res.send( JSON.stringify( info ) );

            } );
        }
        //console.log( res );
        //console.log( info );
        //console.log( user );
        //console.log( err );
        //console.log( req.session.passport );

    } )( req, res, next );
} );

/**
 * logout current user's session
 */
server.post( '/logout', function ( req, res, next ) {
    if ( req.isAuthenticated ) {
        var info = {
            status: 1,
            data: view.loginView().body,    // send the login activity back
        }

        res.send( JSON.stringify( info ) );
    }
    else {
        res.status( 401 ).send( JSON.stringify( {
            status: 0,
            msg: 'User is not login.',
        } ) );
    }

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
server.use( tool.authenticateHere, function ( req, res ) {

    // redirect to /users 
    // since it is authenticated
    res.redirect( '/user' );


} );



module.exports = server;
