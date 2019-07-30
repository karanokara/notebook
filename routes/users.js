var express = require( 'express' );
var router = express.Router();
var tool = require( '../tool' );

var view = {
  siteTitle: 'Notebook - User Notes',
  bodyClasses: 'user',
  username: 'HappyTester',
  userSettingBtnImage: '/files/images/user-setting.svg',
  noteSettingBtnImage: '/files/images/note-setting.svg',
  noteExpand: tool.readFile( 'public/images/arrow-down-s.svg' ),
  appBottomMenus: tool.readFile( 'views/app-bottom-menu.html' ),
  logoImage: '/files/images/note-no-shadow.svg',
};

var appSettingView = {
  items: [
    {
      itemName: 'Unknow'
    },
    {
      itemName: 'Username'
    },
    {
      itemName: 'Password'
    }
  ]
};

var noteSettingView = {
  items: [
    {
      itemName: 'Edit'
    },
    {
      itemName: 'Delete'
    },
    {
      itemName: 'View Details'
    }
  ]
};

var noteAddView = {
  title: "New",
  items: [
    {
      itemName: 'note'
    },
  ]
};

/* GET users listing. */
router.get( '/', function ( req, res, next ) {
  var userFile = 'user';


  view.body = tool.render( 'user', view );
  view.menuAppSetting = tool.render( 'app-bottom-menu', appSettingView );
  view.menuNoteSetting =
    view.menuNoteAdd =
    view.userData = tool.fetchNoteData( userFile );
  // render index.html using view obj
  res.render( 'index', view );
} );

module.exports = router;
