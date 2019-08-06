var express = require( 'express' );
var passport = require( 'passport' );
var tool = require( '../tool' );
var database = require( '../database' );
var view = require( './view' );
var router = express.Router();

var userView = {
    siteTitle: 'Notebook - User Notes',
    bodyClasses: 'user',
    username: 'HappyTester',
    menus: [],
    userSettingBtnImage: '/files/images/user-setting.svg',
    noteExpand: tool.readFile( 'public/images/arrow-down-s.svg' ),
    noteAddBtnImage: tool.readFile( 'public/images/add.svg' ),
    logoImage: '/files/images/note-no-shadow.svg',

};

var appSettingView = {
    title: "Notebook",
    listingClasses: 'flex-column',
    settingId: 'app-setting',
    items: [
        {
            itemName: 'Change username',
            itemIcon: tool.readFile( 'public/images/person.svg' ),
            settingStr: 'username'

        },
        {
            itemName: 'Change password',
            itemIcon: tool.readFile( 'public/images/key.svg' ),
            settingStr: 'password'

        }
    ]
};

var noteSettingView = {
    title: "Note",
    listingClasses: 'flex-column',
    settingId: 'note-setting',
    items: [
        {
            itemName: 'Edit',
            itemIcon: tool.readFile( 'public/images/edit.svg' ),
            settingStr: 'note-edit'
        },
        {
            itemName: 'Delete',
            itemIcon: tool.readFile( 'public/images/delete.svg' ),
            settingStr: 'note-delete'

        },
        {
            itemName: 'View Details',
            itemIcon: tool.readFile( 'public/images/detail.svg' ),
            settingStr: 'note-detail'

        }
    ]
};

var noteAddView = {
    title: "New",
    //listingClasses: 'justify-content-around',
    listingClasses: 'flex-column',
    settingId: 'note-add-setting',
    items: [
        {
            itemName: 'Note',
            itemIcon: tool.readFile( 'public/images/file.svg' ),
            settingStr: 'note-new',
        },
    ]
};

var noteEditView = {
    backBtn: tool.readFile( 'public/images/arrow-left.svg' ),
    deleteBtn: tool.readFile( 'public/images/delete.svg' ),
}


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

        view.userData = re.data;

        view.extend( userView );
        view.menus.length = 0;
        view.menus.push( tool.render( 'app-bottom-menu', appSettingView ) );
        view.menus.push( tool.render( 'app-bottom-menu', noteSettingView ) );
        view.menus.push( tool.render( 'app-bottom-menu', noteAddView ) );

        view.noteEdit = tool.render( 'note-edit', noteEditView );

        view.noteView = tool.render( 'note-view', noteEditView );

        view.body = tool.render( 'user', view );

        // console.log( view );

        // render index.html using view obj
        res.render( 'index', view );
    }
    else
        res.send( re.msg );
} );

module.exports = router;
