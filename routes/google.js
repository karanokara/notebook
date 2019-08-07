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
    function ( accessToken, refreshToken, profile, cb ) {
        console.log( accessToken );
        console.log( refreshToken );
        console.log( profile );
        cb( null, 'meme' );
    }
) );


router.use( '/',
    passport.authenticate( 'google',
        {
            scope: ['profile']
        }
    )
);


router.get( '/google/callback',
    passport.authenticate( 'google', { failureRedirect: '/login' } ),
    function ( req, res ) {
        res.send( 'reach me!!!!!!!!!!!' );
    }
);



module.exports = router;
