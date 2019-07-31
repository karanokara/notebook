var express = require( 'express' );
var tool = require( '../tool' );
var view = require( './view' );
var router = express.Router();

var userView = {
  siteTitle: 'Notebook - User Notes',
  bodyClasses: 'user',
  username: 'HappyTester',
  menus: [],
  userSettingBtnImage: '/files/images/user-setting.svg',
  noteSettingBtnImage: '/files/images/note-setting.svg',
  noteExpand: tool.readFile( 'public/images/arrow-down-s.svg' ),
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
      settingStr: 'edit'
    },
    {
      itemName: 'Delete',
      itemIcon: tool.readFile( 'public/images/delete.svg' ),
      settingStr: 'delete'

    },
    {
      itemName: 'View Details',
      itemIcon: tool.readFile( 'public/images/detail.svg' ),
      settingStr: 'detail'

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
      settingStr: 'note',
      itemIcon: tool.readFile( 'public/images/file.svg' ),
    },
  ]
};

/* GET users listing. */
router.get( '/', function ( req, res, next ) {
  var userFile = 'user';

  view.extend( userView );
  view.menus.length = 0;
  view.menus.push( tool.render( 'app-bottom-menu', appSettingView ) );
  view.menus.push( tool.render( 'app-bottom-menu', noteSettingView ) );
  view.menus.push( tool.render( 'app-bottom-menu', noteAddView ) );

  view.userData = tool.fetchNoteData( userFile );

  view.body = tool.render( 'user', view );

  // console.log( view );

  // render index.html using view obj
  res.render( 'index', view );
} );

module.exports = router;
