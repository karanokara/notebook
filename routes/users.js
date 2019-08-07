var express = require( 'express' );
var passport = require( 'passport' );
var tool = require( '../tool' );
var database = require( '../database' );
var view = require( './view' );
var router = express.Router();


router.use( '/', function ( req, res, next ) {
    console.log( 'In user.js: ---------------- session is: ' );
    console.log( req.session.passport );
    next();
} );



/* GET users listing. */
router.get( '/', tool.authenticateHere, function ( req, res, next ) {

    var username = req.session.passport.user,
        password = '123',
        re = database.userLogin( username, password, 0 );

    if ( re.status ) {

        // console.log( view );

        // render index.html using view obj

        res.render( 'index', view.userView( re.data ) );
    }
    else
        res.send( re.msg );
} );

module.exports = router;
