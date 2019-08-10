var express = require( 'express' );
var passport = require( 'passport' );
var tool = require( '../tool' );
var database = require( '../database' );
var view = require( './view' );
var router = express.Router();
var passport = require( 'passport' );
var strategyGoogle = require( 'passport-google-oauth20' ).Strategy;



passport.use( new strategyGoogle(
    {
        clientID: '138963585819-r1senhdn9mnlv9k6b198u9n1ti1fs8at.apps.googleusercontent.com',
        clientSecret: 'zFAv-QmM5R9C7QlE2YtfpXrj',
        // After authorization, Google
        // will redirect the user back to this application at  
        callbackURL: "/google/callback"
    },
    /**
     * 3.
     * after profile come back from google,
     * this fnc is called
     * @param {*} accessToken 
     * @param {*} refreshToken 
     * @param {*} profile 
     * @param {*} done 
     */
    function ( accessToken, refreshToken, profile, done ) {
        console.log( accessToken );
        console.log( refreshToken );
        console.log( profile );

        var username = profile.id,
            name = profile.displayName,
            imageURL = profile._json.picture,
            info = database.userLogin( username, '', 0 );

        if ( !info.status ) {
            // user not exist, add a new one
            info = database.addUser( username, name, imageURL );
        }

        info.data = view.userView( info.data ).body;

        // user is just username
        // so session is storing username
        return done( null, username, info );
    }
) );

/**
 * 2.
 * After user login in to google account or not
 * google redirect the page back to this route
 * then, Fire passport.authenticate( 'google') with the code from google like:
 * http://localhost:3000/google/callback?code=4%2FnQE8tsSuayDTk-wihe-T04vUZXbvCmk8QXiSqIqZhU9jK0gWDBJxvK5QMT9jwrYyPTboWnAZ3dQ2quAVBniCIrQ&scope=profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile#
 * 
 * to check this code, comment fnc below: passport.authenticate( 'google')
 * 
 * Inside passport.authenticate( 'google') with code,
 * this fnc go out to google to get profile,
 * then call #3 fnc
 * 
 * 4.
 * callback fnc below get call after done() above is finished
 * info is put into req.authInfo
 */
router.get( '/callback',
    passport.authenticate( 'google' ),
    function ( req, res ) {
        // res.send( 'reach me!!!!!!!!!!!' );

        // send back google.html
        // console.log( req.authInfo );
        res.render( 'google', { data: JSON.stringify( req.authInfo ) } );
    }
);

/**
 * 1. 
 * authenticate with google
 * Show a page of google official login page
 * 
 */
router.use( '/',
    passport.authenticate( 'google',
        {
            scope: ['profile']
        }
    )
);



module.exports = router;
