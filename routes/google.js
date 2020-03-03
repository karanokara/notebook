var express = require( 'express' );
var passport = require( 'passport' );
var tool = require( '../tool' );
var database = require( '../database' );
var view = require( './view' );
var router = express.Router();
var passport = require( 'passport' );
var privateData = require( '../private' );
var strategyGoogle = require( 'passport-google-oauth20' ).Strategy;



passport.use( new strategyGoogle(
    {
        clientID: privateData.googleClientID,
        clientSecret: privateData.googleClientSecret,
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

        var userData = {
            username: profile.id,
            name: profile.displayName,
            img: profile._json.picture,
        };

        function callback ( info ) {
            var userId = info.data['_id'];
            info.data = view.userView( info.data ).body;

            // session is storing a obj including username
            // this obj == req.session.passport.user
            done( null, { userId: userId, username: userData.username, }, info );
        }

        database.userLogin( null, userData.username, null, null, function ( info ) {
            if ( !info.status ) {
                // user not exist, add a new one
                database.addUser( userData, function ( info ) {
                    callback( info );
                } );
            }
            else {
                callback( info );
            }
        } );

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
